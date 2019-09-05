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
            'event' => ['required', Rule::in(Alert::LESS_THAN, Alert::ANY_CHANGE, Alert::LESS_THAN_ABSOLUTE)],
            'threshold_unit' => ['nullable', Rule::in(Alert::PERCENT, Alert::CURRENCY), 'required_with:threshold_value'],
            'threshold_value' => ['nullable', 'numeric', Rule::requiredIf($this->request->get('event') === 'less_than')],
        ];
    }
}
