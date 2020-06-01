import { Component, OnInit, OnDestroy } from "@angular/core";
import p5 from "p5";
import { Socket } from "ngx-socket-io";
import { Subscription } from "rxjs";
import { templateJitUrl } from "@angular/compiler";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit, OnDestroy {
  canvas: any;
  sw = 2;
  strokeColor = "black";
  private _sub: Subscription;
  mouse = this.socket.fromEvent<string>("drawing");
  constructor(private socket: Socket) {}
  ngOnDestroy() {
    this._sub.unsubscribe();
  }
  ngOnInit() {
    let temp: string;
    this._sub = this.mouse.subscribe((res) => {
      temp = res;
    });
    const sketch = (s) => {
      s.setup = () => {
        let canvas = s.createCanvas(s.windowWidth - 200, s.windowHeight - 100);

        canvas.parent("sketch-holder");

        s.background(255);

        s.rect(0, 0, s.width, s.height);
      };

      s.draw = async () => {
        if (temp != undefined) {
          if (temp === "Yeah") s.setup();
          else {
            let m = temp.split(" ");
            s.line(+m[0], +m[1], +m[2], +m[3]);
          }
        }
        if (s.mouseIsPressed) {
          s.stroke(this.strokeColor);
          s.strokeWeight(this.sw);
          if (s.mouseButton === s.LEFT) {
            this.socket.emit(
              "canvas",
              s.mouseX + " " + s.mouseY + " " + s.pmouseX + " " + s.pmouseY
            );
            s.line(s.mouseX, s.mouseY, s.pmouseX, s.pmouseY);
          } else if (s.mouseButton === s.CENTER) {
            s.background(255);
          }
        }
      };

      // s.mouseReleased = () => {
      //   // modulo math forces the color to swap through the array provided
      //   this.strokeColor = (this.strokeColor + 1) % this.c.length;
      //   s.stroke(this.c[this.strokeColor]);
      //   console.log(`color is now ${this.c[this.strokeColor]}`);
      // };

      s.keyPressed = () => {
        if (s.key === "c") {
          this.socket.emit("canvas", "Yeah");
          s.setup();
        }
      };
    };

    this.canvas = new p5(sketch);
  }
  colorChange(color) {
    this.strokeColor = color;
  }
}
