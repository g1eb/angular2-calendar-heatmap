import { EventEmitter, ElementRef } from '@angular/core';
export declare type UnaryFunction<T, R> = (source: T) => R;
export declare enum OverviewType {
    global = 0,
    year = 1,
    month = 2,
    week = 3,
    day = 4,
}
export interface CalendarHeatmapItem {
    date?: Date;
}
export interface CalendarHeatmapChangeEvent {
    overview: OverviewType;
    start: Date;
    end: Date;
}
export interface CalendarHeatmapDataSummary {
    name: string;
    value: number;
}
export interface CalendarHeatmapDataDetail extends CalendarHeatmapItem {
    name: string;
    value: number;
}
export interface CalendarHeatmapData extends CalendarHeatmapItem {
    details?: CalendarHeatmapDataDetail[];
    summary?: CalendarHeatmapDataSummary[];
    total?: number;
}
export declare class CalendarHeatmap {
    element: ElementRef;
    data: CalendarHeatmapData[];
    color: string;
    overview: OverviewType;
    /**
    * Helper function to convert seconds to a human readable format
    * @param seconds Integer
    */
    formatTime: UnaryFunction<number, string>;
    /**
    * Function for project label
    */
    projectLabel: UnaryFunction<string, string>;
    /**
    * Function for year label
    */
    yearLabel: UnaryFunction<Date, string>;
    /**
    * Function for month label
    */
    monthLabel: UnaryFunction<Date, string>;
    /**
    * Function for week label
    */
    weekLabel: UnaryFunction<number, string>;
    /**
    * Function for day of week label
    */
    dayOfWeekLabel: UnaryFunction<Date, string>;
    /**
    * Function for time label
    */
    timeLabel: UnaryFunction<Date, string>;
    buildGlobalTooltip: UnaryFunction<CalendarHeatmapData, string>;
    buildYearTooltip: UnaryFunction<CalendarHeatmapData, string>;
    buildMonthTooltip: UnaryFunction<[CalendarHeatmapDataSummary, Date], string>;
    buildWeekTooltip: UnaryFunction<[CalendarHeatmapDataSummary, Date], string>;
    buildDayTooltip: UnaryFunction<CalendarHeatmapDataDetail, string>;
    handler: EventEmitter<object>;
    onChange: EventEmitter<CalendarHeatmapChangeEvent>;
    private gutter;
    private item_gutter;
    private width;
    private height;
    private item_size;
    private label_padding;
    private max_block_height;
    private transition_duration;
    private in_transition;
    private tooltip_width;
    private tooltip_padding;
    private history;
    private selected;
    private svg;
    private items;
    private labels;
    private buttons;
    private tooltip;
    /**
     * Check if data is available
     */
    ngOnChanges(): void;
    /**
     * Get hold of the root element and append our svg
     */
    ngAfterViewInit(): void;
    /**
     * Utility function to get number of complete weeks in a year
     */
    getNumberOfWeeks(): number;
    /**
     * Utility funciton to calculate chart dimensions
     */
    calculateDimensions(): void;
    /**
     * Recalculate dimensions on window resize events
     */
    onResize(event: any): void;
    /**
     * Helper function to check for data summary
     */
    updateDataSummary(): void;
    /**
     * Draw the chart based on the current overview type
     */
    drawChart(): void;
    /**
     * Draw global overview (multiple years)
     */
    drawGlobalOverview(): void;
    /**
     * Draw year overview
     */
    drawYearOverview(): void;
    /**
     * Draw month overview
     */
    drawMonthOverview(): void;
    /**
     * Draw week overview
     */
    drawWeekOverview(): void;
    /**
     * Draw day overview
     */
    drawDayOverview(): void;
    /**
     * Helper function to calculate item position on the x-axis
     * @param d object
     */
    calcItemX(d: CalendarHeatmapItem, start_of_year: any): number;
    /**
     * Helper function to calculate item position on the y-axis
     * @param d object
     */
    calcItemY(d: CalendarHeatmapItem): number;
    /**
     * Helper function to calculate item size
     * @param d object
     * @param max number
     */
    calcItemSize(d: CalendarHeatmapData, max: number): number;
    /**
     * Draw the button for navigation purposes
     */
    drawButton(): void;
    /**
     * Transition and remove items and labels related to global overview
     */
    removeGlobalOverview(): void;
    /**
     * Transition and remove items and labels related to year overview
     */
    removeYearOverview(): void;
    /**
     * Transition and remove items and labels related to month overview
     */
    removeMonthOverview(): void;
    /**
     * Transition and remove items and labels related to week overview
     */
    removeWeekOverview(): void;
    /**
     * Transition and remove items and labels related to daily overview
     */
    removeDayOverview(): void;
    /**
     * Helper function to hide the tooltip
     */
    hideTooltip(): void;
    /**
     * Helper function to hide the back button
     */
    hideBackButton(): void;
}
