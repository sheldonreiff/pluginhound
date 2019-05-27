<?php

namespace Custom;

use Illuminate\Support\Facades\Log;

class ApifyClient
{
    public function get($method, $data=[])
    {
        return $this->request('get', $method, $data);
    }

    public function post($method, $data=[])
    {
        return $this->request('post', $method, $data);
    }

    private function request($http_method, $method, $data=[])
    {
        $endpoint = config('services.apify.endpoint');

        $url = "{$endpoint}/$method";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $http_method == 'get' && $data ? $url.'?'.http_build_query($data) : $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($http_method),
            CURLOPT_POSTFIELDS => $data ? json_encode($data) : null,
            CURLOPT_HTTPHEADER => array(
                "content-type: application/json"
            ),
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1
        ]);

        $res = [
            'data' => curl_exec($curl),
            'http_code' => curl_getinfo($curl, CURLINFO_HTTP_CODE),
            'errors' => curl_error($curl)
        ];

        curl_close($curl);

        if(!($res['http_code'] >= 200 and $res['http_code'] < 300)){
            Log::error("Error: $url");
            Log::error($res);
            return false;
        }
        return json_decode($res['data']);
    }
}