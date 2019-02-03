import {
  Point,
  getDistance,
  distanceToString,
  pointToString
} from "../../common/point";
import { getElementById } from "./util";

interface NavigationView {
  onSetCurrentPosition: (() => void) | null;
  from: Point | null;
  to: Point | null;
}

export default () => {
  const distanceText = getElementById("distance-text") as TextElement;
  const toText = getElementById("to-text") as TextElement;
  const toCurrentPositionButton = getElementById(
    "to-current-position-button"
  ) as ComboButton;

  let from: Point | null;
  let to: Point | null;

  const update = () => {
    if (to === null) {
      toText.text = "Set a target";
      return;
    }

    toText.text = pointToString(to);
    if (from === null) {
      distanceText.text = "Wating for GPS";
      return;
    }

    distanceText.text = distanceToString(getDistance(from, to));
  };

  const self: NavigationView = {
    onSetCurrentPosition: null,
    get from() {
      return from;
    },

    set from(value) {
      from = value;
      update();
    },
    get to() {
      return to;
    },
    set to(value) {
      to = value;
      update();
    }
  };

  toCurrentPositionButton.addEventListener("click", () => {
    if (self.onSetCurrentPosition) {
      self.onSetCurrentPosition();
    }
  });

  return self;
};