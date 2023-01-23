// ARAYÜZ ELEMENTLERİ SEÇELİM
const ad = document.getElementById("ad");
const soyad = document.getElementById("soyad");
const mail = document.getElementById("mail");

const form = document.getElementById("form-rehber");
const kisiListesi = document.querySelector(".kisi-listesi");

//event listenerların tanımlanması
form.addEventListener("submit", kaydet);
kisiListesi.addEventListener("click", kisiIslemleriniYap);

// tüm kişiler için dizi
const tumKisilerDizisi = [];
let secilenSatir = undefined;

function kisiIslemleriniYap(event) {
  if (event.target.classList.contains("btn--delete")) {
    const silinecekTr = event.target.parentElement.parentElement;
    const silinecekMail =
      event.target.parentElement.previousElementSibling.textContent;
    rehberdenSil(silinecekTr, silinecekMail);
  } else if (event.target.classList.contains("btn--edit")) {
    document.querySelector(".kaydet-guncelle").value = "Güncelle";
    const secilenTr = event.target.parentElement.parentElement;
    const guncellenecekMail = secilenTr.cells[2].textContent; // burda previousElementSibling de kullanabilirdim yukardaki gibi ama tablolarla çalıştığım için böyle de kulanabilirim.

    ad.value = secilenTr.cells[0].textContent;
    soyad.value = secilenTr.cells[1].textContent;
    mail.value = secilenTr.cells[2].textContent;

    secilenSatir = secilenTr;
    console.log(tumKisilerDizisi);
  }
}

function rehberdenSil(silinecekTrElement, silinecekMail) {
  silinecekTrElement.remove();
  console.log(silinecekTrElement, silinecekMail);
  //maile gore silme işlemi
  tumKisilerDizisi.forEach((kisi, index) => {
    if (kisi.mail === silinecekMail);
    tumKisilerDizisi.splice(index, 1); //direkt o diziden eleman siler yeni dizi oluşturmaz.
  });

  // filter ile 2. yol
  // const silinmeyecekKisiler = tumKisilerDizisi.filter(function (kisi, index) {
  //   return kisi.mail !== silinecekMail;
  // });

  // tumKisilerDizisi.length = 0;
  // tumKisilerDizisi.push(...silinmeyecekKisiler);
  alanlariTemizle();
  document.querySelector(".kaydet-guncelle").value = "Kaydet";
}

function kaydet(e) {
  e.preventDefault();

  const eklenecekVeyaGuncellenecekKisi = {
    ad: ad.value,
    soyad: soyad.value,
    mail: mail.value,
  };

  const sonuc = verileriKontrolEt(eklenecekVeyaGuncellenecekKisi);
  if (sonuc.durum) {
    if (secilenSatir) {
      console.log(tumKisilerDizisi);
      kisiyiGuncelle(eklenecekVeyaGuncellenecekKisi);
    } else {
      kisiyiEkle(eklenecekVeyaGuncellenecekKisi);
    }
  } else {
    bilgiOlustur(sonuc.mesaj, sonuc.durum);
  }
  //console.log(eklenecekKisi);
}

function kisiyiGuncelle(kisi) {
  // kisi parametresinde seçilen kişinin yeni değerleri vardır.
  // secilen satirda da eski değerler var.
  for (let i = 0; i < tumKisilerDizisi.length; i++) {
    if (tumKisilerDizisi[i].mail === secilenSatir.cells[2].textContent) {
      tumKisilerDizisi[i] = kisi;
      break;
    }
  }

  secilenSatir.cells[0].textContent = kisi.ad;
  secilenSatir.cells[1].textContent = kisi.soyad;
  secilenSatir.cells[2].textContent = kisi.mail;

  document.querySelector(".kaydet-guncelle").value = "Kaydet";
  secilenSatir = undefined;
}

function verileriKontrolEt(kisi) {
  //objelerde in kullanımı
  for (const deger in kisi) {
    if (kisi[deger]) {
      console.log(kisi[deger]);
    } else {
      const sonuc = { durum: false, mesaj: "Boş alan bırakmayınız" };
      return sonuc;
    }
  }
  alanlariTemizle();
  return {
    durum: true,
    mesaj: "Kaydedildi",
  };
}

function bilgiOlustur(mesaj, durum) {
  const olusturulanBilgi = document.createElement("div");
  olusturulanBilgi.textContent = mesaj;
  olusturulanBilgi.className = "bilgi";
  if (durum) {
    olusturulanBilgi.classList.add("bilgi--success");
  } else {
    olusturulanBilgi.classList.add("bilgi--error");
  }

  //kısa if kullanımı
  //olusturulanBilgi.classList.add(durum ? "bilgi--success" : "bilgi--error");

  document.querySelector(".container").insertBefore(olusturulanBilgi, form);

  //setTimeOut, setInterval
  setTimeout(function () {
    const silinecekDiv = document.querySelector(".bilgi");
    if (silinecekDiv) {
      silinecekDiv.remove();
    }
  }, 2000);
}

function alanlariTemizle() {
  ad.value = "";
  soyad.value = "";
  mail.value = "";
}

function kisiyiEkle(eklenecekKisi) {
  const olusturulanTrElementi = document.createElement("tr");
  olusturulanTrElementi.innerHTML = `<td>${eklenecekKisi.ad}</td>
  <td>${eklenecekKisi.soyad}</td>
  <td>${eklenecekKisi.mail}</td>
  <td>
    <button class="btn btn--edit"><i class="far fa-edit"></i></button>
    <button class="btn btn--delete">
      <i class="far fa-trash-alt"></i>
    </button>
  </td>`;

  kisiListesi.appendChild(olusturulanTrElementi);
  tumKisilerDizisi.push(eklenecekKisi);
  bilgiOlustur("Kişi rehbere kaydedildi", true);
}
