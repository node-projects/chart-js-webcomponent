import { BaseCustomWebComponentConstructorAppend, css, html } from "@node-projects/base-custom-webcomponent";
import Chart from 'chart.js/auto/auto.js';
//import Chart from 'chart.js/auto';

type DataObject = { value: number, label: number | string };
type DataArray = [value: number, label: number | string];
type Data = DataObject | DataArray;

function requestAnimationFramePromise() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}
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
        backgroundColor: String,
        enableXScale: Boolean,
        enableYScale: Boolean,
        type: String
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

    #enableXScale: boolean = false;
    public get enableXScale() {
        return this.#enableXScale;
    }
    public set enableXScale(value) {
        this.#enableXScale = value;
        if (this.#ready) {
            this.#renderChart();
        }
    }

    #enableYScale: boolean = false;
    public get enableYScale() {
        return this.#enableYScale;
    }
    public set enableYScale(value) {
        this.#enableYScale = value;
        if (this.#ready) {
            this.#renderChart();
        }
    }

    #type: 'line' | 'bar' = 'line';
    public get type() {
        return this.#type;
    }
    public set type(value) {
        if (this.#type != value) {
            if (this.#chart) {
                this.#chart.destroy();
                this.#chart = null;
            }
            this.#type = value;
            if (this.#ready) {
                this.#renderChart();
            }
        }
    }

    #root: HTMLCanvasElement;
    #ready: boolean;
    #chart: Chart<'line' | 'bar', number[], string | number>;

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

    async #renderChart() {
        let labels: (string | number)[];
        let values: number[];
        if (Array.isArray(this.#data[0])) {
            labels = this.#data.map(row => row[1]);
            values = this.#data.map(row => row[0]);
        } else {
            labels = this.#data.map(row => (<DataObject>row).label);
            values = this.#data.map(row => (<DataObject>row).value);
        }

        //if (this.#chart)
        //    this.#chart.destroy();

        if (this.offsetWidth == 0 || this.offsetHeight == 0)
            await requestAnimationFramePromise();

        if (this.#chart) {
            this.#chart.data.labels = labels;
            this.#chart.data.datasets[0].data = values;
            this.#chart.data.datasets[0].borderColor = this.#borderColor;
            this.#chart.data.datasets[0].backgroundColor = this.#backgroundColor;
            this.#chart.options.scales.x.display = this.#enableXScale;
            this.#chart.options.scales.y.display = this.#enableYScale;
            this.#chart.update();
        } else {
            this.#chart = new Chart(
                this.#root,
                {
                    type: this.#type,
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
                            },
                            tooltip: {
                                enabled: false
                            }
                        },
                        elements: {
                            point: {
                                radius: 0
                            }
                        },
                        scales: {
                            x: {
                                display: this.#enableXScale
                            },
                            y: {
                                display: this.#enableYScale
                            }
                        },

                    }
                }
            );
        }
    }
}

customElements.define(ChartJsWebcomponent.is, ChartJsWebcomponent);