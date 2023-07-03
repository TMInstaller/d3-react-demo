import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function HighchartPage() {
  const options = {
    chart: {
      type: "area",
      zoomType: "x",
      panning: true,
      panKey: "shift",
      scrollablePlotArea: {
        minWidth: 600,
      },
    },
    title: {
      text: "My chart",
    },
    series: [
      {
        data: Array.from(
          { length: 20 },
          () => Math.floor(Math.random() * 40) + 1
        ),
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default HighchartPage;
