// Colour palette
var colourPalette = {
	textColour: "#333333",
	bgColour: "#ffffff",
	mainColour1: "#3B82A0",
	mainColour2: "#FF6D3F",
	mainColour3: "#FF5DA2",
	mainColour4: "#e8d685",
	mutedGrey: "#333333"
}

AmCharts.useUTC = true;

AmCharts.themes.dark = {

	themeName: "dark",

	AmChart: {
		color: colourPalette.textColour,
		backgroundColor: colourPalette.bgColour,
		backgroundAlpha: 0,
		fontSize: 12
	},

	AmCoordinateChart: {
		colors: [
			colourPalette.mainColour1,
			colourPalette.mainColour2,
			colourPalette.mainColour3,
			colourPalette.mainColour4,
			"#1B998B",
			"#8DC1B9",
			"#3B82A0",
			"#e8d685",
			"#e0ad63",
			"#d48652",
			"#ae85c9",
			"#495fba",
			"#7a629b",
			"#8881cc"
		]
	},

	// AmStockChart: {
	// 	colors: ["#639dbd", "#e8d685", "#ae85c9", "#c9f0e1", "#d48652", "#629b6d", "#719dc3", "#719dc3"]
	// },

	// AmSlicedChart: {
	// 	outlineAlpha: 1,
	// 	outlineThickness: 2,
	// 	labelTickColor: "#FFFFFF",
	// 	labelTickAlpha: 0.3,
	// 	colors: ["#495fba", "#e8d685", "#ae85c9", "#c9f0e1", "#d48652", "#629b6d", "#719dc3", "#719dc3"]
	// },

	// AmRectangularChart: {
	// 	zoomOutButtonColor: '#FFFFFF',
	// 	zoomOutButtonRollOverAlpha: 0.15,
	// 	zoomOutButtonImage: "lensWhite"
	// },

	AxisBase: {
		axisColor: colourPalette.textColour,
		gridColor: colourPalette.mutedGrey,
		axisAlpha: 0.2,
		gridAlpha: 0.1,
		dashLength: 3
	},

	ChartScrollbar: {
		enabled: true,
		color: colourPalette.textColour,
        hideResizeGrips: true,
        scrollbarHeight: 25,
		backgroundColor: "transparent",
		backgroundAlpha: 0,
		graphFillAlpha: 0,
		graphLineAlpha: 0.2,
		graphLineColor: colourPalette.textColour,
		graphFillColor: colourPalette.mutedGrey,
		selectedGraphFillColor: colourPalette.mutedGrey,
		selectedGraphFillAlpha:0,
		selectedGraphLineColor: colourPalette.mutedGrey,
		selectedGraphLineAlpha:0.6,
		selectedBackgroundColor: colourPalette.mutedGrey,
		selectedBackgroundAlpha: 0.19,
		gridAlpha: 0.15
	},

	ChartCursor: {
		enabled: true,
		oneBalloonOnly: true,
		cursorColor: colourPalette.mainColour1,
		color: colourPalette.bgColour,
		cursorAlpha: 0.3,
        cursorPosition: "middle",
        categoryBalloonDateFormat: "EEE, MMM DD, HH:MM",
        cursorAlpha: 0.3,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true,
        valueLineAlpha: 0.30
	},

	AmBalloon: {
		animationDuration: 0.2,
        color: colourPalette.textColour,
        borderThickness: 1,
        cornerRadius: 2,
        fillAlpha: 0.8,
        fillColor: colourPalette.bgColour
	},

	AmLegend: {
		enabled: true,
        align: "center",
        position: "bottom",
        useGraphSettings: true,
        switchable: true,
        markerSize: 10,
		color: colourPalette.textColour
	},

	AmGraph: {
		lineAlpha: 0.9
	},


	GaugeArrow: {
		color: "#FFFFFF",
		alpha: 0.8,
		nailAlpha: 0,
		innerRadius: "40%",
		nailRadius: 15,
		startWidth: 15,
		borderAlpha: 0.8,
		nailBorderAlpha: 0
	},

	GaugeAxis: {
		tickColor: "#FFFFFF",
		tickAlpha: 1,
		tickLength: 15,
		minorTickLength: 8,
		axisThickness: 3,
		axisColor: '#FFFFFF',
		axisAlpha: 1,
		bandAlpha: 0.8
	},

	TrendLine: {
		lineColor: "#c03246",
		lineAlpha: 0.8
	},

	// ammap
	AreasSettings: {
		alpha: 0.8,
		color: "#FFFFFF",
		colorSolid: "#000000",
		unlistedAreasAlpha: 0.4,
		unlistedAreasColor: "#FFFFFF",
		outlineColor: "#000000",
		outlineAlpha: 0.5,
		outlineThickness: 0.5,
		rollOverColor: "#3c5bdc",
		rollOverOutlineColor: "#000000",
		selectedOutlineColor: "#000000",
		selectedColor: "#f15135",
		unlistedAreasOutlineColor: "#000000",
		unlistedAreasOutlineAlpha: 0.5
	},

	LinesSettings: {
		color: "#FFFFFF",
		alpha: 0.8
	},

	ImagesSettings: {
		alpha: 0.8,
		labelColor: "#FFFFFF",
		color: "#FFFFFF",
		labelRollOverColor: "#3c5bdc"
	},

	ZoomControl: {
		buttonFillAlpha:0.7,
		buttonIconColor:"#494949"
	},

	SmallMap: {
		mapColor: "#FFFFFF",
		rectangleColor: "#FFFFFF",
		backgroundColor: "#000000",
		backgroundAlpha: 0.7,
		borderThickness: 1,
		borderAlpha: 0.8
	},

	// the defaults below are set using CSS syntax, you can use any existing css property
	// if you don't use Stock chart, you can delete lines below
	PeriodSelector: {
		color: "#e7e7e7"
	},

	PeriodButton: {
		color: "#e7e7e7",
		background: "transparent",
		opacity: 0.7,
		border: "1px solid rgba(255, 255, 255, .15)",
		MozBorderRadius: "5px",
		borderRadius: "5px",
		margin: "1px",
		outline: "none",
		boxSizing: "border-box"
	},

	PeriodButtonSelected: {
		color: "#e7e7e7",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		border: "1px solid rgba(255, 255, 255, .3)",
		MozBorderRadius: "5px",
		borderRadius: "5px",
		margin: "1px",
		outline: "none",
		opacity: 1,
		boxSizing: "border-box"
	},

	PeriodInputField: {
		color: "#e7e7e7",
		background: "transparent",
		border: "1px solid rgba(255, 255, 255, .15)",
		outline: "none"
	},

	DataSetSelector: {
		color: "#e7e7e7",
		selectedBackgroundColor: "rgba(255, 255, 255, .25)",
		rollOverBackgroundColor: "rgba(255, 255, 255, .15)"
	},

	DataSetCompareList: {
		color: "#e7e7e7",
		lineHeight: "100%",
		boxSizing: "initial",
		webkitBoxSizing: "initial",
		border: "1px solid rgba(255, 255, 255, .15)"
	},

	DataSetSelect: {
		border: "1px solid rgba(255, 255, 255, .15)",
		outline: "none"
	}

};