<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    private Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    // Always use config() — env() returns null after php artisan config:cache
                    'cloud_name' => config('services.cloudinary.cloud_name'),
                    'api_key'    => config('services.cloudinary.api_key'),
                    'api_secret' => config('services.cloudinary.api_secret'),
                ],
                'url' => ['secure' => true],
            ])
        );
    }

    /**
     * Upload an image file to Cloudinary.
     *
     * @param  UploadedFile  $file
     * @param  string        $folder   e.g. 'avatars', 'proofs'
     * @return string  Secure URL
     */
    public function uploadImage(UploadedFile $file, string $folder = 'uploads'): string
    {
        $result = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'          => "taskora/{$folder}",
                'resource_type'   => 'image',
                'transformation'  => [
                    ['quality' => 'auto', 'fetch_format' => 'auto'],
                ],
            ]
        );

        return $result['secure_url'];
    }

    /**
     * Upload with eager transformations for avatars (auto-crop to square).
     */
    public function uploadAvatar(UploadedFile $file): string
    {
        $result = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'         => 'taskora/avatars',
                'resource_type'  => 'image',
                'transformation' => [
                    ['width' => 400, 'height' => 400, 'crop' => 'fill', 'gravity' => 'face'],
                    ['quality' => 'auto', 'fetch_format' => 'auto'],
                ],
            ]
        );

        return $result['secure_url'];
    }
}
