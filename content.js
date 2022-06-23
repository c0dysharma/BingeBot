//Creates Node Array of node element required by telegra.ph API 
function createContent(data) {
  let content = [];
  for (let movie of data) {
    let title = { "tag": "b", "children": [`${movie.title} (${movie.year}) • Rating ${movie.rating}` ] };
    let genre = { "tag": "p", "children": [`\n- ${movie.genres}`] };
    let overview = { "tag": "i", "children": [`\n${movie.overview}`]
}

    let format = {
      "tag": "ul", "children": [
        {
          "tag": "li", "children": []
        }
      ]
    }
    format.children[0].children.push(title);
    format.children[0].children.push(genre);
    format.children[0].children.push(overview);
    content.push(format);
  }
  return content;
}

module.exports = createContent;