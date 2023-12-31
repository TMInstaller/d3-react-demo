import { useEffect, useRef } from "react";
import "./App.css";
import * as d3 from "d3";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import HighchartPage from "./HighchartPage";

function App() {
  const nodes = [
    { id: "node1", name: "Node 1" },
    { id: "node2", name: "Node 2" },
    { id: "node3", name: "Node 3" },
    { id: "node4", name: "Node 4" },
    { id: "node5", name: "Node 5" },
    { id: "node6", name: "Node 6" },
    { id: "node7", name: "Node 7" },
    { id: "node8", name: "Node 8" },
    { id: "node9", name: "Node 9" },
    { id: "node10", name: "Node 10" },
  ];

  const links = [
    { source: "node1", target: "node2", name: "Link 1-2" },
    { source: "node1", target: "node3", name: "Link 1-3" },
    { source: "node1", target: "node4", name: "Link 1-4" },
    { source: "node2", target: "node3", name: "Link 2-3" },
    { source: "node2", target: "node4", name: "Link 2-4" },
    { source: "node2", target: "node5", name: "Link 2-5" },
    { source: "node3", target: "node4", name: "Link 3-4" },
    { source: "node3", target: "node5", name: "Link 3-5" },
    { source: "node3", target: "node6", name: "Link 3-6" },
    { source: "node4", target: "node5", name: "Link 4-5" },
    { source: "node4", target: "node6", name: "Link 4-6" },
    { source: "node4", target: "node7", name: "Link 4-7" },
    { source: "node5", target: "node6", name: "Link 5-6" },
  ];

  const svgRef = useRef();
  const width = 1600;
  const height = 1000;

  useEffect(() => {
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(svgRef.current);

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "#69b3a2");

    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .text((d) => d.name);

    function getConnectedNodes(node, depth = 0, nodeSet = new Set()) {
      if (depth > 2) return nodeSet;
      nodeSet.add(node.id);
      links.forEach((link) => {
        if (link.source === node.id && !nodeSet.has(link.target)) {
          getConnectedNodes(
            nodes.find((n) => n.id === link.target),
            depth + 1,
            nodeSet
          );
        }
        if (link.target === node.id && !nodeSet.has(link.source)) {
          getConnectedNodes(
            nodes.find((n) => n.id === link.source),
            depth + 1,
            nodeSet
          );
        }
      });
      return nodeSet;
    }

    node.on("click", (event, d) => {
      const connectedNodes = Array.from(getConnectedNodes(d));
      node.attr("fill", (n) =>
        connectedNodes.includes(n.id) ? "#69b3a2" : "#ddd"
      );
      link.style("stroke", (l) =>
        connectedNodes.includes(l.source.id) &&
        connectedNodes.includes(l.target.id)
          ? "#999"
          : "#ddd"
      );
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, []);

  return (
    <Router>
      <div className='App'>
        <svg ref={svgRef} width={width} height={height} />
        <Link to='/highchart'>Go to Highchart</Link>
        <Routes>
          <Route path='/highchart' element={<HighchartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
