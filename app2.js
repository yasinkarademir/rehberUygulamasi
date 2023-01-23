class Kisi {
  constructor(ad, soyad, mail) {
    this.ad = ad;
    this.soyad = soyad;
    this.mail = mail;
  }
}

class Util {
  static bosAlanKontrolEt(...alanlar) {
    let sonuc = true;
    alanlar.forEach((alan) => {
      if (alan.length === 0) {
        sonuc = false;
        return false;
      }
    });
    return sonuc;
  }

  static emailGecerliMi(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

class Ekran {
  constructor() {
    this.ad = document.getElementById("ad");
    this.soyad = document.getElementById("soyad");
    this.mail = document.getElementById("mail");
    this.ekleGuncelleButon = document.querySelector(".kaydet-guncelle");
    this.form = document.getElementById("form-rehber");
    this.form.addEventListener("submit", this.kaydetGuncelle.bind(this));
    this.kisiListesi = document.querySelector(".kisi-listesi");
    this.kisiListesi.addEventListener("click", this.guncelleVeyaSil.bind(this));
    this.depo = new Depo();
    this.secilenSatir = undefined;
    this.kisileriEkranaYazdir();
  }

  bilgiOlustur(mesaj, durum) {
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

    document
      .querySelector(".container")
      .insertBefore(olusturulanBilgi, this.form);

    //setTimeOut, setInterval
    setTimeout(function () {
      const silinecekDiv = document.querySelector(".bilgi");
      if (silinecekDiv) {
        silinecekDiv.remove();
      }
    }, 2000);
  }

  kaydetGuncelle(e) {
    e.preventDefault();
    const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
    const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.mail);
    const emailGecerliMi = Util.emailGecerliMi(this.mail.value);
    console.log(this.mail.value + " için mail kontolü: " + emailGecerliMi);
    if (sonuc) {
      //tüm alanlar doldurulmuş
      if (!emailGecerliMi) {
        this.bilgiOlustur("Geçerli bir mail yazınız", false);
        return;
      }

      if (this.secilenSatir) {
        //secilen satir undefined değilse güncellenecek demektir
        this.kisiyiEkrandaGuncelle(kisi);
      } else {
        //secilen satir undefined ise ekleme yapılacaktır
        //yeni kisiyi ekrana ekler

        //localstorage ekle
        const sonuc = this.depo.kisiEkle(kisi);
        console.log("sonuc: " + sonuc + "kaydet guncelle içindeyiz");
        if (sonuc) {
          this.bilgiOlustur("Başarıyla eklendi", true);

          this.kisiyiEkranaEkle(kisi);
          this.alanlariTemizle();
        } else {
          this.bilgiOlustur("Bu mail kullanımda", false);
        }
      }
    } else {
      //bazı alanlar eksik
      this.bilgiOlustur("Boş alanları doldurunuz", false);
    }
  }

  alanlariTemizle() {
    this.ad.value = "";
    this.soyad.value = "";
    this.mail.value = "";
  }

  guncelleVeyaSil(e) {
    const tiklanmaYeri = e.target;
    if (tiklanmaYeri.classList.contains("btn--delete")) {
      this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
      this.kisiyiEkrandanSil();
    } else if (tiklanmaYeri.classList.contains("btn--edit")) {
      this.secilenSatir = tiklanmaYeri.parentElement.parentElement;

      this.ekleGuncelleButon.value = "Güncelle";
      this.ad.value = this.secilenSatir.cells[0].textContent;
      this.soyad.value = this.secilenSatir.cells[1].textContent;
      this.mail.value = this.secilenSatir.cells[2].textContent;
    }
  }

  kisiyiEkrandaGuncelle(kisi) {
    const sonuc = this.depo.kisiGuncelle(
      kisi,
      this.secilenSatir.cells[2].textContent
    );

    if (sonuc) {
      this.secilenSatir.cells[0].textContent = kisi.ad;
      this.secilenSatir.cells[1].textContent = kisi.soyad;
      this.secilenSatir.cells[2].textContent = kisi.mail;

      this.depo.kisiGuncelle(kisi, this.secilenSatir.cells[2].textContent);
      this.alanlariTemizle();
      this.secilenSatir = undefined;
      this.bilgiOlustur("Kişi güncellendi", true);
    } else {
      this.bilgiOlustur("Yazdıgınız mail kullanımda", false);
    }
  }

  kisiyiEkrandanSil() {
    this.secilenSatir.remove();
    const silinecekMail = this.secilenSatir.cells[2].textContent;
    this.depo.kisiSil(silinecekMail);
    this.alanlariTemizle();
    this.secilenSatir = undefined;
    this.ekleGuncelleButon.value = "Kaydet";
    this.bilgiOlustur("Kişi rehberden silindi", true);
  }

  kisileriEkranaYazdir() {
    this.depo.tumKisiler.forEach((kisi) => {
      this.kisiyiEkranaEkle(kisi);
    });
  }

  kisiyiEkranaEkle(kisi) {
    const olusturulanTr = document.createElement("tr");
    olusturulanTr.innerHTML = `<td>${kisi.ad}</td>
    <td>${kisi.soyad}</td>
    <td>${kisi.mail}</td>
    <td>
      <button class="btn btn--edit"><i class="far fa-edit"></i></button>
      <button class="btn btn--delete">
        <i class="far fa-trash-alt"></i>
      </button>
    </td>`;
    this.kisiListesi.appendChild(olusturulanTr);
  }
}

class Depo {
  //uygulama ilk açıldığında verileri getirir.
  constructor() {
    this.tumKisiler = this.kisileriGetir();
  }

  emailEssizMi(mail) {
    const sonuc = this.tumKisiler.find((kisi) => {
      return kisi.mail === mail;
    });
    //demekki bu maili kullanan biri var
    if (sonuc) {
      console.log(mail + "kullanımda");
      return false;
    } else {
      console.log(mail + "kullanımda değil ekleme güncelleme yapılabilir");
      return true;
    }
  }

  kisileriGetir() {
    let tumKisilerLocal;
    if (localStorage.getItem("tumKisiler") === null) {
      tumKisilerLocal = [];
    } else {
      tumKisilerLocal = JSON.parse(localStorage.getItem("tumKisiler"));
    }
    return tumKisilerLocal;
  }
  kisiEkle(kisi) {
    if (this.emailEssizMi(kisi.mail)) {
      this.tumKisiler.push(kisi);
      localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
      return true;
    } else {
      return false;
    }
  }

  kisiSil(mail) {
    this.tumKisiler.forEach((kisi, index) => {
      if (kisi.mail === mail) {
        this.tumKisiler.splice(index, 1);
      }
    });
    localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
  }

  //guncellenmisKisi : yeni değerleri içerir
  //mail kişinin veritabanında bulunması için gerekli olan eski maili içerir
  kisiGuncelle(guncellenmisKisi, mail) {
    if (guncellenmisKisi.mail === mail) {
      this.tumKisiler.forEach((kisi, index) => {
        if (kisi.mail === mail) {
          this.tumKisiler[index] = guncellenmisKisi;
          localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
          return true;
        }
      });

      return true;
    }
    if (this.emailEssizMi(guncellenmisKisi.mail)) {
      console.log(
        guncellenmisKisi.mail +
          "için kontrol yapılıyot ve sonuc: guncelleme yapabilirsin"
      );

      this.tumKisiler.forEach((kisi, index) => {
        if (kisi.mail === mail) {
          this.tumKisiler[index] = guncellenmisKisi;
          localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
          return true;
        }
      });

      return true;
    } else {
      console.log(
        guncellenmisKisi.mail + "mail kullanımda guncelleme yapılamaz"
      );
      return false;
    }
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  const ekran = new Ekran();
});
