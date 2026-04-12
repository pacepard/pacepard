// src/hooks/useLocationDetection.ts
import { useCallback } from 'react';

const useLocationDetection = () => {
    const detectUserLocation = useCallback(async () => {
        try {
            // Try to detect user location using browser Geolocation API
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Location detected successfully
                        console.log('User location detected:', {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        // You can store this in state or send to your backend here
                    },
                    (error) => {
                        // Location detection failed
                        console.warn(
                            'Location detection failed:',
                            error.message,
                        );
                    },
                );
            }
        } catch (error) {
            console.warn('Location detection error:', error);
        }
    }, []);

    return {
        detectUserLocation,
    };
};

export default useLocationDetection;
