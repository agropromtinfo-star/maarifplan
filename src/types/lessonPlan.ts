export interface DersBilgisi {
  Sinif: string;
  Ders: string;
  Ogrenme_Birimi: string;
  Sure: string;
  Alan_Becerileri: string;
  Egilimler: string;
}

export interface ProgramlarArasiBilesenler {
  Sosyal_Duygusal_Ogrenme_Becerileri: string;
  Degerler: string;
  Okuryazarlik_Becerileri: string;
  Disiplinler_Arasi_Iliski: string;
  Beceriler_Arasi_Iliski: string;
}

export interface OgrenmeOgretmeYasantilari {
  Temel_Kabuller: string;
  On_Degerlendirme_Sureci: string;
  Kopru_Kurma: string;
  Haftalik_Ozet?: string;
  Ogretme_Uygulamalari: string[];
  Guduleme: string[];
  Dikkat_Cekme: string[];
  Ek_Ogretme_Uygulamalari: string[];
}

export interface MaarifLessonPlan {
  Ders_Bilgisi: DersBilgisi;
  Programlar_Arasi_Bilesenler: ProgramlarArasiBilesenler;
  Ogrenme_Ciktilari_ve_Surec_Bilesenleri: string;
  Icerik_Cercevesi: string;
  Ogrenme_Kanitlari: string;
  Ogrenme_Ogretme_Yasantilari: OgrenmeOgretmeYasantilari;
  Farklilastirma: string;
}

export interface YillikPlanWeekItem {
  id: string;
  haftaNo: number;
  haftaEtiketi: string; // Örn: "1. HAFTA"
  tarihAraligi: string; // Örn: "14 - 18 Eylül"
  onayTarihi: string; // Örn: "14/09/2026"
  ogrenmeBirimi?: string;
  icerikCercevesi?: string;
  konuVeCiktiOzeti?: string;
  sure?: string;
  ogrenmeKanitlari?: string;
  ogretmeUygulamalari?: string[];
  haftalikOzet?: string;
}

export interface DocumentHeaderFooterMeta {
  okulAdi: string;
  egitimOgretimYili: string;
  dersIsmi: string;
  sinifDuzeyi: string;
  haftaEtiketi: string; // Örn: "1. HAFTA"
  tarihAraligi: string; // Örn: "14 - 18 Eylül"
  onayTarihi: string; // Örn: "14/09/2026"
  ogretmenAdSoyad: string;
  ogretmenBransi: string;
  okulMuduruAdSoyad: string;
}

export interface LessonPlanInputs {
  yillik_plan: string;
  ders_materyali: string;
  ders_bilgi_formu?: string;
  meta?: DocumentHeaderFooterMeta;
}

export interface SavedLessonPlanRecord {
  id: string;
  createdAt: string;
  title: string;
  department: string;
  inputs: LessonPlanInputs;
  meta: DocumentHeaderFooterMeta;
  plan: MaarifLessonPlan;
}


