<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Alert;

class AlertStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $alert = $this->route('alert');

        return !$alert || $alert->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'alert_method' => ['required', 'in:email'],
            'event' => ['required', 'in:less_than,any_change'],
            'threshold_unit' => ['nullable', 'in:percent,currency', 'required_with:threshold_value'],
            'threshold_value' => ['nullable', 'numeric', Rule::requiredIf($this->request->get('event') === 'less_than')],
            'product_sku' => ['required', 'exists:products,sku']
        ];
    }
}
