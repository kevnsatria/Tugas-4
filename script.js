const map = L.map('map').setView([-7.975, 112.633], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 18,
  minZoom: 10,
}).addTo(map);

// Koordinat tiap kecamatan
const districts = [
  { name: "Klojen", coords: [-7.982, 112.630] },
  { name: "Blimbing", coords: [-7.939, 112.647] },
  { name: "Lowokwaru", coords: [-7.952, 112.611] },
  { name: "Sukun", coords: [-8.003, 112.614] },
  { name: "Kedungkandang", coords: [-7.978, 112.664] }
];

// ubah icon marker
const customIcon = L.icon({
    iconUrl: 'assets/marker.png',
    iconSize: [30, 30],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40]
  });

// Fungsi ambil data cuaca dari Open-Meteo API
async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&daily=precipitation_sum&timezone=Asia%2FBangkok`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    precipitation: data.daily.precipitation_sum[0]
  };
}

// Tambahkan marker dan popup dinamis
districts.forEach(async district => {
  const weather = await getWeather(district.coords[0], district.coords[1]);

  const popupContent = `
    <b>${district.name}</b><br>
    Lat: ${district.coords[0]}<br>
    Lon: ${district.coords[1]}<br>
    <hr>
    <b>Cuaca Saat Ini:</b><br>
    Suhu: ${weather.temperature} °C<br>
    Curah Hujan Hari Ini: ${weather.precipitation} mm
  `;

  L.marker(district.coords, { icon:customIcon})
    .addTo(map)
    .bindPopup(popupContent);
});
