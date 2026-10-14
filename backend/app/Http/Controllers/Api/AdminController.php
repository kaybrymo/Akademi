<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PaymentGateway;
use App\Services\PaymentGatewayService;
use Illuminate\Http\Request;

class AdminController extends Controller {
    public function stats() {
        return response()->json(['users' => User::count()]);
    }
    public function users(Request $request) {
        return response()->json(User::paginate(15));
    }
    public function suspendUser($id) {
        return response()->json(['message' => 'Suspended']);
    }
    public function gateways() {
        return response()->json(PaymentGateway::all());
    }
    public function addGateway(Request $request) {
        $validated = $request->validate([
            'name'       => 'required|string',
            'public_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'provider'   => 'nullable|string',
        ]);

        $autoConfig = PaymentGatewayService::autoConfigureGateway(
            $validated['provider'] ?? $validated['name'],
            $validated['public_key'] ?? '',
            $validated['secret_key'] ?? ''
        );

        $gateway = PaymentGateway::create(array_merge($validated, [
            'webhook_url'  => $autoConfig['webhook_url'],
            'extra_config' => $autoConfig,
            'is_active'    => true
        ]));

        return response()->json([
            'gateway'     => $gateway,
            'auto_config' => $autoConfig,
            'message'     => 'Gateway registered and self-configured successfully.'
        ], 201);
    }
    public function updateGateway(Request $request, $id) {
        $gateway = PaymentGateway::findOrFail($id);
        $validated = $request->validate([
            'name'        => 'sometimes|string',
            'public_key'  => 'nullable|string',
            'secret_key'  => 'nullable|string',
            'webhook_url' => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
        ]);

        $autoConfig = PaymentGatewayService::autoConfigureGateway(
            $gateway->name,
            $validated['public_key'] ?? $gateway->public_key,
            $validated['secret_key'] ?? $gateway->secret_key
        );

        $gateway->update(array_merge($validated, [
            'webhook_url'  => $validated['webhook_url'] ?? $autoConfig['webhook_url'],
            'extra_config' => $autoConfig,
        ]));

        return response()->json([
            'gateway'     => $gateway,
            'auto_config' => $autoConfig,
            'message'     => 'Gateway keys updated and parameters self-configured.'
        ]);
    }
    public function setDefaultGateway($id) {
        PaymentGateway::query()->update(['is_default' => false]);
        PaymentGateway::findOrFail($id)->update(['is_default' => true]);
        return response()->json(['message' => 'Default payment provider updated']);
    }
    public function initiateRefund(Request $request) {
        $validated = $request->validate([
            'transaction_ref' => 'required|string',
            'amount'          => 'required|numeric|min:1',
            'reason'          => 'required|string',
            'gateway'         => 'nullable|string',
        ]);

        $result = PaymentGatewayService::processRefund(
            $validated['transaction_ref'],
            (float) $validated['amount'],
            $validated['reason'],
            $validated['gateway'] ?? 'Paystack'
        );

        return response()->json($result);
    }
    public function commissionSettings() {
        return response()->json(['commission' => 10]);
    }
    public function updateCommission(Request $request) {
        return response()->json(['message' => 'Commission updated']);
    }
}
