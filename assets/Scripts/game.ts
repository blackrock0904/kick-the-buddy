// import { Touch } from './../../creator.d';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  buddy: cc.Node;
  back: cc.Node;
  sk: sp.Skeleton;
  btnTaser: cc.Node;
  btnCandy: cc.Node;
  black: cc.Node;
  buttonResult: cc.Node;
  iconResult: cc.Node;

  timer: number = 0;
  isEnd: boolean = false;
  duration: number = 1500;

  onLoad() {
    this.buddy = this.node.getChildByName("buddy");
    this.back = this.node.getChildByName("back");
    this.sk = this.buddy.getComponent(sp.Skeleton);
    this.btnTaser = this.node.getChildByName("btn_taser");
    this.btnCandy = this.node.getChildByName("btn_candy");
    this.black = this.node.getChildByName("black");
    this.buttonResult = this.node.getChildByName("button_result");
    this.iconResult = this.node.getChildByName("icon_result");

    this.buttonResult.on(cc.Node.EventType.TOUCH_START, () => {
      const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform);
      window.location.href = isMacLike ? 'https://apps.apple.com/us/app/kick-the-buddy-forever/id1435346021' : 'https://play.google.com/store/apps/details?id=com.playgendary.kickthebuddy&hl=en';
    }, this);
    cc.view.setResizeCallback(() => { this.setSize() });
    this.setSize();
    this.setBtnHandler(this.btnTaser);
    this.setBtnHandler(this.btnCandy);
    this.sk.setAnimation(0, "idle_normal", true);
  }

  setBtnHandler(target: cc.Node): void {
    target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  resetBtnHandler(target: cc.Node): void {
    target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  setSize() {
    const offset = this.node.width * 0.01;
    const frameSize = cc.view.getVisibleSize();
    this.node.width = frameSize.width;
    this.node.height = frameSize.height;

    if (this.node.width >= this.node.height) {
      this.btnCandy.x = this.node.width / 2 - this.btnCandy.width / 2 - 20;
      this.btnTaser.x = this.btnCandy.x;
      this.btnCandy.y = - this.node.height / 2 + this.btnCandy.height / 2 + 20;
      this.btnTaser.y = this.btnCandy.y + this.btnTaser.height + 20;
    } else {
      this.buddy.scale = 0.6;
      this.btnCandy.x = this.node.width / 2 - this.btnCandy.width / 2 - offset;
      this.btnTaser.x = -this.node.width / 2 + this.btnTaser.width / 2 + offset;
      this.btnCandy.y = -this.node.height / 2 + this.btnCandy.height / 2 + offset;
      this.btnTaser.y = this.btnCandy.y;

      this.btnCandy.width = this.btnCandy.height = this.btnTaser.width = this.btnTaser.height = this.node.width / 4;
      this.iconResult.width = this.node.width * 0.7;
      this.iconResult.height = this.iconResult.width * 0.31;
      this.buttonResult.width = this.node.width;
      this.buttonResult.height = this.buttonResult.width * 0.31;
      this.btnCandy.children[0].width = this.btnCandy.width * 0.6;
      this.btnCandy.children[0].height = this.btnCandy.height * 0.8;
      this.btnCandy.children[0].y = this.btnCandy.height * 0.05;
      this.btnTaser.children[0].width = this.btnCandy.width * 0.8;
      this.btnTaser.children[0].height = this.btnCandy.height * 0.8;
      this.btnTaser.children[0].y = this.btnCandy.height * 0.05;
    }
    this.back.width = this.node.width;
    this.back.height = this.node.height;
    this.black.width = this.node.width;
    this.black.height = this.node.height;
    this.iconResult.y = this.node.height;
    this.buttonResult.y = -this.node.height;
  }

  onTouchStart(e: cc.Event.EventTouch): void {
    if (!this.isEnd) {
      this.timer = Date.now();
      switch (e.target._name) {
        case 'btn_taser':
          this.sk.setAnimation(0, 'idle_shock', true);
          this.btnCandy.runAction(cc.fadeOut(.2));
          break;
        case 'btn_candy':
          this.sk.setAnimation(0, 'idle_candy', true);
          this.btnTaser.runAction(cc.fadeOut(.2));
          break;
        default: return;
      }
    }
  }

  onTouchEnd(e: cc.Event.EventTouch): void {
    this.sk.setAnimation(0, "idle_normal", true);
    this.timer = 0;
    switch (e.target._name) {
      case 'btn_taser':
        this.isEnd ? this.btnTaser.runAction(cc.fadeOut(.2)) : this.btnCandy.runAction(cc.fadeIn(.2));
        break;
      case 'btn_candy':
        this.isEnd ? this.btnCandy.runAction(cc.fadeOut(.2)) : this.btnTaser.runAction(cc.fadeIn(.2));
        break;
      default: return;
    }
  }

  onDestroy() {
    this.resetBtnHandler(this.btnTaser);
    this.setBtnHandler(this.btnCandy);
  }

  update(dt) {
    let delta = Date.now() - this.duration;
    if ((this.timer > 0) && (delta > this.timer)) {
      if (!this.isEnd) {
        this.black.runAction(cc.fadeTo(.5, 150));
        this.buttonResult.runAction(cc.moveTo(.5, cc.v2(0, -this.node.y + this.buttonResult.height)));
        this.iconResult.runAction(cc.moveTo(.5, cc.v2(0, this.node.y - this.iconResult.height)));
        this.isEnd = true;
      }
    }
  }
}
