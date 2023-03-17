import { generatePoint } from "../mock/task";

export default class pointsModel {
    point = Array.from({length: 10}, generatePoint);

    getPoint = () => this.point;
}