if (window.AFRAME) AFRAME.registerComponent("tata-surya", {
  init: function () {
    // Nilai untuk visualisasi, bukan skala astronomi sebenarnya.
    const dataPlanet = [
      {
        nama: "Merkurius",
        tekstur: "assets/textures/merkurius.jpg",
        warna: "#a8a8a8",
        radius: 0.1,
        orbit: 0.85,
        periode: 8,
      },
      {
        nama: "Venus",
        tekstur: "assets/textures/venus.jpg",
        warna: "#e6bb78",
        radius: 0.15,
        orbit: 1.25,
        periode: 11,
      },
      {
        nama: "Bumi",
        warna: "#3498db",
        radius: 0.16,
        orbit: 1.7,
        periode: 15,
        tekstur: "assets/textures/bumi.jpg",
      },
      {
        nama: "Mars",
        tekstur: "assets/textures/mars.jpg",
        warna: "#d65a3a",
        radius: 0.12,
        orbit: 2.15,
        periode: 19,
      },
      {
        nama: "Jupiter",
        warna: "#c99b70",
        radius: 0.3,
        orbit: 2.85,
        periode: 26,
      },
      {
        nama: "Saturnus",
        tekstur: "assets/textures/saturnus.jpg",
        warna: "#e5ce91",
        radius: 0.25,
        orbit: 3.65,
        periode: 33,
      },
      {
        nama: "Uranus",
        tekstur: "assets/textures/uranus.jpg",
        warna: "#8de0e5",
        radius: 0.2,
        orbit: 4.4,
        periode: 40,
      },
      {
        nama: "Neptunus",
        tekstur: "assets/textures/neptunus.jpg",
        warna: "#4169e1",
        radius: 0.19,
        orbit: 5.05,
        periode: 48,
      },
    ];

    this.planet = [];
    this.dijeda = false;
    this.pengaliKecepatan = 1;
    // Wadah planet untuk mode detail.
    this.planetDetail = document.createElement("a-entity");
    this.planetDetail.setAttribute("visible", false);
    this.planetDetail.setAttribute("position", "0 1.4 0");
    this.el.appendChild(this.planetDetail);

    // Matahari
    const matahari = document.createElement("a-sphere");
    matahari.setAttribute("radius", 0.42);
    matahari.setAttribute("material", {
      color: "#ffba26",
      shader: "flat",
    });
    this.el.appendChild(matahari);

    // Pencahayaan
    const ambient = document.createElement("a-entity");
    ambient.setAttribute("light", {
      type: "ambient",
      intensity: 0.8,
    });
    this.el.appendChild(ambient);

    const cahayaMatahari = document.createElement("a-entity");
    cahayaMatahari.setAttribute("light", {
      type: "point",
      intensity: 1.2,
      distance: 20,
      decay: 1,
    });
    this.el.appendChild(cahayaMatahari);

    dataPlanet.forEach((data, index) => {
      // Garis orbit berada pada bidang horizontal.
      const garisOrbit = document.createElement("a-ring");
      garisOrbit.setAttribute("radius-inner", data.orbit - 0.012);
      garisOrbit.setAttribute("radius-outer", data.orbit + 0.012);
      garisOrbit.setAttribute("rotation", "-90 0 0");
      garisOrbit.setAttribute("material", {
        color: "#b8c4db",
        shader: "flat",
        side: "double",
        transparent: true,
        opacity: 0.5,
      });
      this.el.appendChild(garisOrbit);

      // Wadah ini mengelilingi Matahari.
      const pusatOrbit = document.createElement("a-entity");
      this.el.appendChild(pusatOrbit);

      // Bola berjarak sesuai radius orbit dari pusat.
      const bola = document.createElement("a-sphere");
      bola.setAttribute("radius", data.radius);
      bola.setAttribute("position", `${data.orbit} 0 0`);
      const materialPlanet = {
        color: data.tekstur ? "#ffffff" : data.warna,
        roughness: 0.85,
        metalness: 0,
      };

      if (data.tekstur) {
        materialPlanet.src = `#tekstur-${data.nama.toLowerCase()}`;
      }

      bola.setAttribute("material", materialPlanet);
      pusatOrbit.appendChild(bola);

      // Titik pada permukaan membantu memperlihatkan rotasi bola.
      const penandaRotasi = document.createElement("a-sphere");
      penandaRotasi.setAttribute("radius", data.radius * 0.15);
      penandaRotasi.setAttribute("position", `0 0 ${data.radius}`);
      penandaRotasi.setAttribute("material", {
        color: "#ffffff",
        shader: "flat",
      });
      if (!data.tekstur) {
        bola.appendChild(penandaRotasi);
      }

      // Cincin Saturnus
      if (data.nama === "Saturnus") {
        const cincin = document.createElement("a-ring");
        cincin.setAttribute("radius-inner", 0.33);
        cincin.setAttribute("radius-outer", 0.49);
        cincin.setAttribute("rotation", "-65 0 0");
        cincin.setAttribute("material", {
          color: "#d6bc82",
          shader: "flat",
          side: "double",
          transparent: true,
          opacity: 0.85,
        });
        bola.appendChild(cincin);
      }

      const sudutAwal = index * (360 / dataPlanet.length);
      pusatOrbit.object3D.rotation.y = THREE.MathUtils.degToRad(sudutAwal);

      this.planet.push({
        data,
        nama: data.nama,
        pusatOrbit,
        bola,
        kecepatanOrbit: (Math.PI * 2) / data.periode,
      });
    });
  },

  tick: function (waktu, selisihWaktu) {
    if (!selisihWaktu || this.dijeda) return;

    const detik = (Math.min(selisihWaktu, 100) / 1000) * this.pengaliKecepatan;
    this.planetDetail.object3D.rotation.y += 0.8 * detik;
    this.planet.forEach((planet) => {
      planet.pusatOrbit.object3D.rotation.y += planet.kecepatanOrbit * detik;

      planet.bola.object3D.rotation.y += 0.8 * detik;
    });
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status-aplikasi");
  const marker = document.getElementById("marker-hiro");
  const statusMarker = document.getElementById("status-marker");
  marker.addEventListener("markerFound", () => {
    statusMarker.textContent = "Marker ditemukan. Selamat menjelajah!";
    statusMarker.dataset.found = "true";
  });
  marker.addEventListener("markerLost", () => {
    statusMarker.textContent = "Marker tidak ditemukan. Arahkan kembali kamera ke Hiro.";
    statusMarker.dataset.found = "false";
  });
  window.addEventListener("camera-init", () => {
    status.textContent = "Kamera aktif. Cari marker Hiro.";
  });
  window.addEventListener("camera-error", () => {
    status.textContent = "Kamera gagal dibuka. Periksa izin kamera dan gunakan HTTPS atau localhost.";
  });
  document.querySelectorAll("a-assets img").forEach((tekstur) => {
    const gagalTekstur = () => {
      status.textContent = `Tekstur gagal dimuat: ${tekstur.getAttribute("src")}. Periksa file lalu muat ulang.`;
    };
    tekstur.addEventListener("error", gagalTekstur);
    if (tekstur.complete && !tekstur.naturalWidth) gagalTekstur();
  });
  if (!window.AFRAME || !AFRAME.systems["arjs"]) {
    status.textContent = "Library AR gagal dimuat. Periksa koneksi internet lalu muat ulang.";
    return;
  }
  const pilihanPlanet = document.getElementById("pilih-planet");
  const informasi = document.getElementById("informasi-planet");
  const tombolJeda = document.getElementById("tombol-jeda");
  const pilihanKecepatan = document.getElementById("kecepatan");
  const sistem = document.getElementById("tata-surya");
  const kontrol = [pilihanPlanet, tombolJeda, pilihanKecepatan];
  kontrol.forEach((elemen) => { elemen.disabled = !sistem.components["tata-surya"]; });
  sistem.addEventListener("componentinitialized", (event) => {
    if (event.detail.name === "tata-surya") {
      kontrol.forEach((elemen) => { elemen.disabled = false; });
    }
  });

  const faktaPlanet = {
    Merkurius: {
      urutan: 1,
      deskripsi:
        "Planet terdekat dengan Matahari dan planet terkecil di tata surya.",
    },
    Venus: {
      urutan: 2,
      deskripsi:
        "Memiliki atmosfer tebal dan merupakan planet terpanas di tata surya.",
    },
    Bumi: {
      urutan: 3,
      deskripsi:
        "Planet tempat kita tinggal, dengan air cair di permukaan dan satu satelit alami, yaitu Bulan.",
    },
    Mars: {
      urutan: 4,
      deskripsi:
        "Dikenal sebagai Planet Merah dan memiliki dua satelit alami, Phobos dan Deimos.",
    },
    Jupiter: {
      urutan: 5,
      deskripsi:
        "Planet terbesar di tata surya. Bintik Merah Besarnya merupakan badai raksasa.",
    },
    Saturnus: {
      urutan: 6,
      deskripsi:
        "Terkenal dengan cincin yang tersusun dari banyak partikel es dan batuan.",
    },
    Uranus: {
      urutan: 7,
      deskripsi:
        "Sumbu rotasinya sangat miring sehingga terlihat seperti berputar menyamping.",
    },
    Neptunus: {
      urutan: 8,
      deskripsi:
        "Planet terjauh dari Matahari di antara delapan planet dan memiliki angin yang sangat kencang.",
    },
  };

  function ambilKomponen() {
    return sistem.components["tata-surya"];
  }

  pilihanPlanet.addEventListener("change", () => {
    const nama = pilihanPlanet.value;
    const fakta = faktaPlanet[nama];
    const komponen = ambilKomponen();

    if (fakta) {
      informasi.innerHTML = `
        <strong>${nama}</strong>
        <p>Planet ke-${fakta.urutan} dari Matahari.</p>
        <p>${fakta.deskripsi}</p>
      `;
    } else {
      informasi.textContent = "Pilih planet untuk melihat informasinya.";
    }

    if (!komponen) return;

    // Hapus objek detail sebelumnya.
    while (komponen.planetDetail.firstChild) {
      komponen.planetDetail.removeChild(komponen.planetDetail.firstChild);
    }

    const modeDetail = nama !== "";

    // Sembunyikan objek tata surya saat mode detail.
    // Cahaya tetap aktif agar planet detail tetap diterangi.
    Array.from(komponen.el.children).forEach((objek) => {
      if (objek === komponen.planetDetail) return;
      if (objek.hasAttribute("light")) return;

      objek.setAttribute("visible", !modeDetail);
    });

    komponen.planetDetail.setAttribute("visible", modeDetail);
    komponen.planetDetail.object3D.rotation.set(0, 0, 0);

    if (modeDetail) {
      const planetTerpilih = komponen.planet.find(
        (planet) => planet.nama === nama,
      );

      if (!planetTerpilih) return;

      // Buat entitas baru dari data, tanpa menyalin DOM komponen A-Frame.
      const data = planetTerpilih.data;
      const planetBesar = document.createElement("a-sphere");
      planetBesar.setAttribute("radius", data.radius);
      planetBesar.setAttribute("material", {
        color: data.tekstur ? "#ffffff" : data.warna,
        src: data.tekstur ? `#tekstur-${data.nama.toLowerCase()}` : "",
        roughness: 0.85,
        metalness: 0,
      });
      if (nama === "Saturnus") {
        const cincin = document.createElement("a-ring");
        cincin.setAttribute("radius-inner", 0.33);
        cincin.setAttribute("radius-outer", 0.49);
        cincin.setAttribute("rotation", "-65 0 0");
        cincin.setAttribute("material", "color: #d6bc82; shader: flat; side: double; transparent: true; opacity: 0.85");
        planetBesar.appendChild(cincin);
      }
      if (!data.tekstur) {
        const penanda = document.createElement("a-sphere");
        penanda.setAttribute("radius", data.radius * 0.15);
        penanda.setAttribute("position", `0 0 ${data.radius}`);
        penanda.setAttribute("material", "color: white; shader: flat");
        planetBesar.appendChild(penanda);
      }

      // Pindahkan ke pusat wadah detail.
      planetBesar.setAttribute("position", "0 0 0");
      planetBesar.setAttribute("rotation", "0 0 0");

      // Samakan radius tampilan semua planet menjadi 1.1.
      const radiusAsli = Number(planetTerpilih.bola.getAttribute("radius"));
      const skala = 1.1 / radiusAsli;

      planetBesar.setAttribute("scale", `${skala} ${skala} ${skala}`);

      komponen.planetDetail.appendChild(planetBesar);
    }
  });

  tombolJeda.addEventListener("click", () => {
    const komponen = ambilKomponen();
    if (!komponen) return;

    komponen.dijeda = !komponen.dijeda;

    tombolJeda.textContent = komponen.dijeda
      ? "Lanjutkan animasi"
      : "Jeda animasi";
    tombolJeda.setAttribute("aria-pressed", String(komponen.dijeda));
  });

  pilihanKecepatan.addEventListener("change", () => {
    const komponen = ambilKomponen();
    if (!komponen) return;

    komponen.pengaliKecepatan = Number(pilihanKecepatan.value);
  });
});
