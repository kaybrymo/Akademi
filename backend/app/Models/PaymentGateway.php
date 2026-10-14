<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PaymentGateway extends Model {
    protected $guarded = [];
    protected $casts = ['is_active' => 'boolean', 'is_default' => 'boolean', 'extra_config' => 'array'];
}
