import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GoogleMapPicker = ({ onSelectLocation }) => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [center, setCenter] = useState({
        lat: 21.028511, // Vị trí trung tâm mặc định
        lng: 105.804817, // Vị trí trung tâm mặc định
    });
    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    const handleMapClick = (e) => {
        const { latLng } = e;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setCenter({ lat, lng });

        // Sử dụng Geocoder để lấy địa chỉ từ lat, lng
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                setSelectedAddress(results[0].formatted_address); // Cập nhật địa chỉ
                onLocationSelect({ lat, lng, address: results[0].formatted_address }); // Gửi dữ liệu lên cha
            } else {
                alert('Không thể tìm địa chỉ cho vị trí này');
            }
        });
    };



    return (
        <LoadScript googleMapsApiKey="AIzaSyBAy36P7qxniTXAbQeOn3DCh0JfXcN7xME">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onClick={handleMapClick}
            >
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapPicker;
