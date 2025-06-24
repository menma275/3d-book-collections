export async function getCollections() {
  const url = "https://script.google.com/macros/s/AKfycbzXR8qJIl4CHmO9SQ7dp_BoPa_vADsjp5unfXcYtsXOlTsDzhWDWHHEmM4jqy_b40ih/exec";

  const cached = localStorage?.getItem('collections') || null;
  const cachedData = cached ? JSON.parse(cached) : null;

  if (cachedData)
    return cachedData;
  else {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    localStorage.setItem('collections', JSON.stringify(data));

    return data;
  }
}
