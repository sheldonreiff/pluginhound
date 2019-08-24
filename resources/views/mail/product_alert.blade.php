@component('mail::message')
# Price Changed!

@component('mail::panel')
<b>{{ $product->name }}</b> decreased by ${{ $currencyChange }} ({{ $percentChange }}%) to <b>${{ $product->sale_price }}</b>
<img src="{{ $product->thumbnail_url }}" style='display:inline-block'>
@component('mail.product', ['url' => $productUrl, 'color' => 'primary'])
View Product
@endcomponent
@endcomponent

({{ count($alerts) }}) of your alerts triggered this notification. Edit this alert from the <a href="{{ $productUrl }}">product page</a> (make sure you're logged in).

@endcomponent