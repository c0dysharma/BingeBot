//Creates Node Array of node element required by telegra.ph API 
function createContent(data) {
  let content = [];
  for (let movie of data) {
    let paragraph = `${movie.title} (${movie.year}) - ${movie.genres}`;
    let element = { "tag": "p", "children": [`${paragraph}`] };

    let format = {
      "tag": "ul", "children": [
        {
          "tag": "li", "children": []
        }
      ]
    }
    format.children[0].children.push(element);
    content.push(format);
  }
  return content;
}

module.exports = createContent;