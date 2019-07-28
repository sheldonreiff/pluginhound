<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use App\Product;
use App\Mail\Alert as AlertMail;

class Alert extends Notification
{
    use Queueable;

    protected $product;
    protected $changes;
    protected $alerts;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Product $product, $changes, $alerts)
    {
        $this->product = $product;
        $this->changes = $changes;
        $this->alerts = $alerts;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new AlertMail($this->product, $this->changes, $this->alerts))
        ->to($notifiable->email);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'product' => $this->product,
            'changes' => $this->changes,
            'alerts' => $this->alerts,
        ];
    }
}
