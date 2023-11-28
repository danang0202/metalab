<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Announcement extends Notification
{
    use Queueable;
    private $data;

    /**
     * Create a new notification instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        if ($this->data['type'] == 'announcement') {
            return (new MailMessage)
                ->view('emails.emailNotifStage', [
                    'data' => $this->data,
                ]);
        } else if ($this->data['type'] == 'offer') {
            return (new MailMessage)
                ->view('emails.dateChoiceNotif', [
                    'data' => $this->data,
                ]);
        } else if ($this->data['type'] == 'link') {
            return (new MailMessage)
                ->view('emails.notifLink', [
                    'data' => $this->data,
                ]);
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
