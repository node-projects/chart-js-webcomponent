import { BaseCustomWebComponentConstructorAppend, css, html } from "@node-projects/base-custom-webcomponent";
import Chart from 'chart.js/auto/auto.js';

type DataObject = { value: number, label: number | string };
type DataArray = [value: number, label: number | string];
type Data = DataObject | DataArray;

export class ChartJsWebcomponent extends BaseCustomWebComponentConstructorAppend {

    public static override readonly style = css`
            :host {
                display: block;
                position: relative;
            }
            
            canvas {
                width: 100%;
                height: 100%;
                position: absolute;
            }`;

    public static override readonly template = html`<canvas id="root"></canvas>`;

    public static readonly is = 'node-projects-chart-js';

    public static properties = {
        data: Object,
        borderColor: String,
        backgroundColor: String
    }

    #data: Data[]
    public get data() {
        return this.#data;
    }
    public set data(value) {
        this.#data = value;
        if (this.#ready) {
            this.#renderChart();
        }
    }

    #borderColor: string
    public get borderColor() {
        return this.#borderColor;
    }
    public set borderColor(value) {
        this.#borderColor = value;
        if (this.#ready) {
            this.#renderChart();
        }
    }

    #backgroundColor: string
    public get backgroundColor() {
        return this.#backgroundColor;
    }
    public set backgroundColor(value) {
        this.#backgroundColor = value;
        if (this.#ready) {
            this.#renderChart();
        }
    }

    #root: HTMLCanvasElement;
    #ready: boolean;
    #chart: Chart<"line", number[], string | number>;

    constructor() {
        super();
        this._restoreCachedInititalValues();

        this.#root = this._getDomElement<HTMLCanvasElement>('root');
    }

    public ready() {
        this._parseAttributesToProperties(true);
        
        this.#renderChart();
        this.#ready = true;
    }

    #renderChart() {
        let labels: (string | number)[];
        let values: number[];
        if (Array.isArray(this.#data[0])) {
            labels = this.#data.map(row => row[1]);
            values = this.#data.map(row => row[0]);
        } else {
            labels = this.#data.map(row => (<DataObject>row).label);
            values = this.#data.map(row => (<DataObject>row).value);
        }

        if (this.#chart)
            this.#chart.destroy();

        this.#chart = new Chart(
            this.#root,
            {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: values,
                            fill: true,
                            borderColor: this.#borderColor,
                            backgroundColor: this.#backgroundColor
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            }
        );
    }
}

customElements.define(ChartJsWebcomponent.is, ChartJsWebcomponent);