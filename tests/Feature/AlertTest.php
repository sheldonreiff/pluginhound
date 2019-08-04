<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AlertTest extends TestCase
{
    use RefreshDatabase;
    
    /** @test */
    public function can_create_and_get_alert()
    {
        $this->importProducts(['a']);

        $this->json('post', "/api/product/{$this->testAlerts['a']['product_sku']}/alert", $this->testAlerts['a'])
        ->assertStatus(201);

        $this->get("/api/product/{$this->testAlerts['a']['product_sku']}/alerts")
        ->assertJson([
            'data' => [
                $this->testAlerts['a'],
            ]
        ]);

        $this->get("/api/alerts")
        ->assertJson([
            'data' => [
                $this->testAlerts['a'],
            ]
        ]);
    }

    /** @test */
    public function can_not_get_others_alerts(){
        $this->importProducts(['a']);

        $alert = $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        $this->get("/api/alerts")
        ->assertJson([
            'data' => [
                $this->testAlerts['a'],
            ]
        ]);

        $this->be($this->user2);

        $this->get("/api/alerts")
        ->assertJsonMissing([
            'data' => [
                $this->testAlerts['a'],
            ]
        ]);
    }

    /** @test */
    public function can_edit_alert()
    {
        $this->importProducts(['a']);

        $content = $this->json('post', "/api/product/{$this->testAlerts['a']['product_sku']}/alert", $this->testAlerts['a'])
        ->assertStatus(201)
        ->decodeResponseJson();

        $alertDiff = collect([
            'event' => 'less_than',
            'threshold_unit' => 'currency',
            'threshold_value' => 15,
            'product_sku' => $this->testAlerts['a']['product_sku'],
        ]);

        $updatedAlert = collect($this->testAlerts['a'])->merge($alertDiff)->toArray();

        $this->json('patch', "/api/alert/{$content['data']['id']}", $updatedAlert)
        ->assertOk();

        $this->get("/api/product/{$this->testAlerts['a']['product_sku']}/alerts")
        ->assertJson([
            'data' => [
                $updatedAlert ,
            ]
        ]);
    }

    /** @test */
    public function can_only_edit_alerts_created_by_user()
    {
        $this->importProducts(['a']);

        $alert = $this->user
        ->alerts()
        ->create($this->testAlerts['a']);
        
        $alertDiff = collect([
            'event' => 'less_than',
            'threshold_unit' => 'currency',
            'threshold_value' => 15,
            'product_sku' => $this->testAlerts['a']['product_sku'],
        ]);

        $updatedAlert = collect($this->testAlerts['a'])->merge($alertDiff)->toArray();

        $this->be($this->user2);

        $this->json('patch', "/api/alert/{$alert->id}", $updatedAlert)
        ->assertStatus(403);

        $this->be($this->user);

        $this->get("/api/product/{$this->testAlerts['a']['product_sku']}/alerts")
        ->assertJson([
            'data' => [
                $this->testAlerts['a'],
            ]
        ]);

        $this->json('patch', "/api/alert/{$alert->id}", $updatedAlert)
        ->assertOk();
    }

    /** @test */
    public function can_delete_alert()
    {
        $this->importProducts(['a']);

        $alert = $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        $this->delete("/api/alert/{$alert->id}")
        ->assertOk();

        $this->get("/api/product/{$this->testAlerts['a']['product_sku']}/alerts")
        ->assertJsonMissing([
            'data' => [
                $this->testAlerts['a'],
            ]
        ]);
    }
    
    /** @test */
    public function cant_delete_others_alerts()
    {
        $this->importProducts(['a']);

        $alert = $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        $this->be($this->user2);

        $this->delete("/api/alert/$alert->id")
        ->assertStatus(403);

        $this->be($this->user);

        $this->get("/api/product/{$this->testAlerts['a']['product_sku']}/alerts")
        ->assertJson([
            'data' => [
                $this->testAlerts['a'],
            ]
        ]);
    }

    /** @test */
    public function cant_see_others_alerts()
    {
        $this->importProducts(['a']);

        $alert = $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        $this->be($this->user2);

        $this->get("/api/alert/$alert->id")
        ->assertStatus(403);
    }
}
