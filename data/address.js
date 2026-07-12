
export let address;

loadFromStorage();

export function loadFromStorage() {
  address = JSON.parse(localStorage.getItem('address'));

  if (!address) {
    address = {
      name: 'John Doe',
      line1: '123 Main Street',
      line2: '',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    };
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem('address', JSON.stringify(address));
}

export function updateAddress(newAddress) {
  address = { ...address, ...newAddress };
  saveToStorage();
}

export function getShortAddress() {
  const shortAddress = `${address.city}`;
  saveToStorage();
  return shortAddress;
}