async function searchTorrent(snowfl, query, torrentConfig){
  const data = await snowfl.parse(query, torrentConfig);
  return snowfl.url;
}