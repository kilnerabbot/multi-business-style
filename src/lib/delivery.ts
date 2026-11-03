export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

// Johannesburg suburbs — orders in these areas use own delivery
export const JHB_SUBURBS = [
  "Soweto", "Alexandra", "Sandton", "Randburg", "Roodepoort",
  "Midrand", "Fourways", "Bryanston", "Melville", "Parktown",
  "Rosebank", "Illovo", "Morningside", "Edenvale", "Germiston",
  "Alberton", "Boksburg", "Benoni", "Kempton Park", "Ekurhuleni",
  "Orange Farm", "Diepsloot", "Tembisa", "Katlehong", "Thokoza",
  "Vosloorus", "Springs", "Brakpan", "Nigel", "Krugersdorp",
  "Randfontein", "Westonaria", "Lenasia", "Ennerdale", "Eldorado Park",
  "Johannesburg CBD", "Newtown", "Fordsburg", "Jeppestown", "Yeoville",
  "Auckland Park", "Westdene", "Brixton", "Mayfair", "Crown Mines",
  "Wynberg", "Marlboro", "Sunninghill", "Waterfall", "Kyalami",
];

export function isJohannesburgSuburb(suburb: string): boolean {
  return JHB_SUBURBS.some(
    (s) => s.toLowerCase() === suburb.toLowerCase()
  );
}

export function isJohannesburgOrder(province: string, suburb: string): boolean {
  return province === "Gauteng" && isJohannesburgSuburb(suburb);
}

export const DEFAULT_DELIVERY_RATES: Record<string, number> = {
  "Eastern Cape": 120,
  "Free State": 100,
  "Gauteng": 80,
  "KwaZulu-Natal": 110,
  "Limpopo": 130,
  "Mpumalanga": 120,
  "North West": 110,
  "Northern Cape": 150,
  "Western Cape": 130,
};

export const JHB_DELIVERY_RATE = 60;
export const FREE_DELIVERY_ABOVE = 1000;
