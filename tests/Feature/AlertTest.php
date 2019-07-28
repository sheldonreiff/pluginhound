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
    public function can_edit_alert()
    {
        $this->importProducts(['a']);

        $content = $this->json('post', "/api/product/{$this->testAlerts['a']['product_sku']}/alert", $this->testAlerts['a'])
        ->assertStatus(201)
        ->decodeResponseJson();

        $alertDiff = collect([
            'alert_method' => 'email',
            'event' => 'less_than',
            'threshold_unit' => 'currency',
            'threshold_value' => 15,
            'product_sku' => $this->testAlerts['a']['product_sku'],
        ]);

        $this->json('patch', "/api/alert/{$content['data']['id']}", $alertDiff->toArray() )
        ->assertOk();

        $this->get("/api/product/{$this->testAlerts['a']['product_sku']}/alerts")
        ->assertJson([
            'data' => [
                collect($content['data'])
                ->merge($alertDiff)
                ->toArray(),
            ]
        ]);
    }

    /** @test */
    public function can_delete_alert()
    {
        $this->importProducts(['a']);

        $content = $this->json('post', "/api/product/{$this->testAlerts['a']['product_sku']}/alert", $this->testAlerts['a'])
        ->assertStatus(201)
        ->decodeResponseJson();

        $this->delete("/api/alert/{$content['data']['id']}")
        ->assertOk();

        $this->get("/api/product/{$this->testAlerts['a']['product_sku']}/alerts")
        ->assertJsonMissing([
            'data' => [
                $content['data'],
            ]
        ]);
    }
}
