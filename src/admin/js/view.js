export default {
  renderOne(template, data) {
    return template(data);
  },
  renderList(template, data) {
    let html = '';

    data.forEach((item) => {
      html += template(item);
    });

    return html;
  },
};
