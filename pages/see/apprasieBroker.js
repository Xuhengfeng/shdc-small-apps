Page({
  data: {
    star: [//默认的灰色的星星5个
      { isStar: true },
      { isStar: true },
      { isStar: true },
      { isStar: true },
      { isStar: true }
    ],
    star1: '../../images/star-off.png',//红色的星星
    star2: '../../images/star-on.png',//灰色的星星
    tags: ['专业知识很强','服务态度很好','了解市场并给出实用建议','对房源了解并能清晰讲解','看房很高效','了解法律与政策']
  },
  onLoad(options) {
      this.resetStar();
  },
  selectItem(e) {
    this.resetStar();    
    let num = e.target.dataset.index+1;
    for(let i=0;i<num;i++){
      this.data.star[i].isStar=false;
    }          
    this.setData({star: this.data.star})
  },
  //重置默认的星星
  resetStar() {
    this.data.star.forEach((item)=>{
      item.isStar = true;
    })
    this.setData({star: this.data.star});
  }
})