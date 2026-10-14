<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SubjectGroup;
use App\Models\PaymentGateway;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder {
    public function run() {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@akademi.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        $groups = ['Mathematics', 'Sciences', 'Languages', 'Technology', 'Business'];
        foreach ($groups as $group) {
            SubjectGroup::create(['name' => $group, 'slug' => strtolower($group)]);
        }

        PaymentGateway::create([
            'name' => 'Paystack',
            'slug' => 'paystack',
            'is_active' => true,
            'is_default' => true
        ]);
        
        // create dummy tutors and students
        User::factory()->count(5)->create(['role' => 'tutor']);
        User::factory()->count(10)->create(['role' => 'student']);
    }
}
