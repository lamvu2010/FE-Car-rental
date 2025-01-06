import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const LeafletMap = () => {
    const [selectedPosition, setSelectedPosition] = useState(null); // Tọa độ được chọn
    const [address, setAddress] = useState(''); // Địa chỉ từ reverse geocoding

    // Hàm chuyển tọa độ thành địa chỉ
    let timeout;
    const fetchAddressFromCoordinates = async (lat, lng) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                setAddress(data.display_name || 'Không tìm thấy địa chỉ');
            } catch (error) {
                console.error('Error fetching address:', error);
                setAddress('Lỗi khi lấy địa chỉ');
            }
        }, 500); // Chỉ gọi API sau 500ms kể từ lần click cuối
    };


    // Lắng nghe sự kiện click trên bản đồ
    const LocationMarker = () => {
        useMapEvents({
            click(event) {
                const { lat, lng } = event.latlng;
                setSelectedPosition({ lat, lng });
                fetchAddressFromCoordinates(lat, lng); // Gọi API để lấy địa chỉ
            },
        });

        return selectedPosition ? <Marker position={selectedPosition} /> : null;
    };

    return (
        <div>
            <MapContainer
                center={[10.762622, 106.660172]} // Tọa độ mặc định (TP. HCM)
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
            </MapContainer>
            <div className="mt-4">
                {selectedPosition && (
                    <>
                        <p><strong>Tọa độ:</strong> {selectedPosition.lat}, {selectedPosition.lng}</p>
                    </>
                )}
                {address && (
                    <p><strong>Địa chỉ:</strong> {address}</p>
                )}
            </div>
        </div>
    );
};

export default LeafletMap;
