export const NIGERIAN_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank (FCMB)", code: "214" },
  { name: "Globus Bank", code: "103" },
  { name: "Guaranty Trust Bank (GTBank)", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Jaiz Bank", code: "301" },
  { name: "Keystone Bank", code: "082" },
  { name: "Lotus Bank", code: "303" },
  { name: "Optimus Bank", code: "107" },
  { name: "Parallex Bank", code: "104" },
  { name: "Polaris Bank", code: "076" },
  { name: "Premium Trust Bank", code: "105" },
  { name: "Providus Bank", code: "101" },
  { name: "Signature Bank", code: "106" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "SunTrust Bank", code: "100" },
  { name: "Titan Trust Bank", code: "102" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank for Africa (UBA)", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
];

export const NIGERIAN_NAMES = [
  "Adebayo Ogundimu", "Aisha Mohammed", "Chukwuemeka Okeke", "Fatima Abdullahi",
  "Oluwaseun Adeyemi", "Ridwan Adeleke", "Ngozi Okafor", "Ibrahim Musa",
  "Yetunde Bakare", "Emeka Nwosu", "Halima Usman", "Tunde Akindele",
  "Chidinma Eze", "Abdulrahman Suleiman", "Funke Adebisi", "Obinna Nwachukwu",
  "Amina Bello", "Segun Oladipo", "Chiamaka Igwe", "Musa Danjuma",
  "Bukola Fashola", "Ikechukwu Obi", "Zainab Abubakar", "Kayode Alabi",
  "Nneka Onyema", "Aliyu Garba", "Folake Omotosho", "Chinedu Agu",
  "Hauwa Yusuf", "Babatunde Oni", "Ada Okonkwo", "Sani Abdullahi",
  "Omolara Bankole", "Uche Nnamdi", "Rashidat Olanrewaju", "Ifeanyi Mgbeke",
  "Jumoke Ayodele", "Tochukwu Azubuike", "Mariam Idris", "Damilola Oseni",
  "Kelechi Iheanacho", "Safiya Ahmad", "Tobi Olatunji", "Nkechi Udoh",
  "Yusuf Lawal", "Bolanle Aguda", "Nnamdi Okoro", "Habiba Sani",
];

export const BILL_CATEGORIES = [
  {
    name: "Electricity",
    icon: "Zap",
    providers: ["IKEDC", "EKEDC", "AEDC", "PHEDC", "BEDC", "KEDCO", "IBEDC", "JED", "KAEDCO"],
  },
  {
    name: "Cable TV",
    icon: "Tv",
    providers: ["DSTV", "GOtv", "StarTimes", "ShowMax"],
  },
  {
    name: "Internet",
    icon: "Wifi",
    providers: ["Spectranet", "Smile", "Swift", "iPNX", "Tizeti"],
  },
  {
    name: "Water",
    icon: "Droplets",
    providers: ["Lagos Water Corp", "FCT Water Board", "Ogun State Water"],
  },
];

export const NETWORKS = [
  { name: "MTN", color: "45 100% 50%" },
  { name: "Glo", color: "120 100% 35%" },
  { name: "Airtel", color: "0 84% 50%" },
  { name: "9mobile", color: "145 100% 35%" },
];

export const AIRTIME_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export function getRandomName(): string {
  return NIGERIAN_NAMES[Math.floor(Math.random() * NIGERIAN_NAMES.length)];
}

export function generateReference(): string {
  return "OPY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
