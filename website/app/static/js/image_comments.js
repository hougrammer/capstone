class ImageComments {
  constructor(data) {
    this.data = data
    this.best = d3.maxIndex(data, d => +d.score)
    console.log(this.best);
    this.worst = d3.minIndex(data, d => +d.score)
    $("#seeAnother").click(() => { ImageComments.randomRow(data); });
  }
  fillTable() {
    this.data.forEach(d => {
    $("#commentTable").append(
        `<tr>
          <td><img src=${d.url}></td>
          <td>${d.comment}</td>
          <td>${d.score}</td>
        </tr>`
      );
    });
  }
  static randomRow(data) {
    let i = Math.floor(Math.random() * data.length);
    $("#commentRow").html(
      `<td><img src=${data[i].url}></td>
      <td>${data[i].comment}</td>
      <td>${data[i].score}</td>`
    );
  }
  bestRow() {
    $("#commentRow").html(
      `<td><img src=${this.data[this.best].url}></td>
      <td>${this.data[this.best].comment}</td>
      <td>${this.data[this.best].score}</td>`
    );
  }
  worstRow() {
    $("#commentRow").html(
      `<td><img src=${this.data[this.worst].url}></td>
      <td>${this.data[this.worst].comment}</td>
      <td>${this.data[this.worst].score}</td>`
    );
  }
}