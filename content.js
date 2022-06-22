function createContent(data){
  let content = [];
  for(let i=0; i<=5; i++){
    let paragraph = `${data[i].title} (${data[i].year})- ${data[i].genres}`;
    let element = {"tag": "p", "children": [`${paragraph}`]};

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