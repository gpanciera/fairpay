import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({
  list,
  colorList,
  title,
  setSelectedFocus,
  index,
  x,
  y,
}) => {
  // Convert data to percentages with helper function
  const data = getPercentages(list, title.toLowerCase());

  // Create references
  const ref = useRef(null);

  useEffect(() => {
    // Create svg element
    const svgWidth = 50;
    const svgHeight = 50;
    const radius = Math.min(svgWidth, svgHeight) / 2;

    // Set svg dimensions
    const svg = d3
      .select(ref.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .attr('x', x)
      .attr('y', y);

    const g = svg
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`)

    // Set color scale
    const color = d3.scaleOrdinal(colorList);

    // Create pie chart and target percentages
    const pie = d3.pie().value(d => d.percentage);

    // Build arcs
    const path = d3.arc().outerRadius(radius).innerRadius(0);

    // Enter data
    const arc = g.selectAll('arc').data(pie(data)).enter().append('g');

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', d => color(d.data.percentage));
  }, [data]);

  const handleClick = e => {
    setSelectedFocus(index);
  };

  return <svg className="pieChart" onClick={handleClick} ref={ref}></svg>;
};

/**
 * Helper function to get percentages from list. Returns an array of objects
 * @param {Array} array The category list
 * @param {string} keyword 'gender', 'race', 'age'
 * @return {Array} Returns an array of objects with the key value pairs: { category: 'Male', percentage: 53% }
 */
function getPercentages(array, keyword = 'gender') {
  const count = {};

  const total = array.length;
  for (let person of array) {
    const key = person[keyword];
    if (!count.hasOwnProperty(key)) count[key] = 0;
    count[key] += 1;
  }

  const output = [];

  for (let key in count) {
    output.push({ category: key, percentage: (count[key] / total) * 100 });
  }

  return output;
}

export default PieChart;
