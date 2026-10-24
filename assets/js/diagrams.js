// Small SVG diagrams, drawn from code so they follow the light/dark theme.
// Any element with data-diagram="name" gets an <svg> with that drawing.
(function () {
    var NS = 'http://www.w3.org/2000/svg';

    function pen(svg) {
        function el(tag, attrs, cls) {
            var n = document.createElementNS(NS, tag);
            for (var k in attrs) n.setAttribute(k, attrs[k]);
            if (cls) n.setAttribute('class', cls);
            svg.appendChild(n);
            return n;
        }
        var d = {
            rect: function (x, y, w, h, cls, rx) {
                return el('rect', { x: x, y: y, width: w, height: h, rx: rx == null ? 3 : rx, 'stroke-width': 1.25 }, cls || 'stroke');
            },
            line: function (x1, y1, x2, y2, cls, sw) {
                return el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'stroke-width': sw || 1.25 }, cls || 'stroke');
            },
            path: function (dd, cls, sw) {
                return el('path', { d: dd, 'stroke-width': sw || 1.25, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, cls || 'stroke');
            },
            text: function (x, y, s, o) {
                o = o || {};
                var t = el('text', { x: x, y: y, 'font-size': o.size || 11 }, o.cls || '');
                if (o.anchor) t.setAttribute('text-anchor', o.anchor);
                if (o.weight) t.setAttribute('font-weight', o.weight);
                if (o.rotate) t.setAttribute('transform', 'rotate(' + o.rotate + ' ' + x + ' ' + y + ')');
                t.textContent = s;
                return t;
            },
            arrow: function (x1, y1, x2, y2, cls) {
                var a = Math.atan2(y2 - y1, x2 - x1), L = 6, s = 0.5;
                d.line(x1, y1, x2, y2, cls);
                d.path('M' + (x2 - L * Math.cos(a - s)) + ' ' + (y2 - L * Math.sin(a - s)) +
                    ' L' + x2 + ' ' + y2 +
                    ' L' + (x2 - L * Math.cos(a + s)) + ' ' + (y2 - L * Math.sin(a + s)), cls);
            },
            hatch: function (x, y, w, h, gap, cls) {
                // diagonal hatching clipped to a rectangle
                var id = 'h' + Math.random().toString(36).slice(2, 8);
                var cp = el('clipPath', { id: id });
                var r = document.createElementNS(NS, 'rect');
                r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h);
                cp.appendChild(r);
                var dd = '';
                for (var i = -h; i < w; i += gap) dd += 'M' + (x + i) + ' ' + (y + h) + ' l' + h + ' ' + (-h);
                var p = d.path(dd, (cls || 'stroke') + ' thin', 0.8);
                p.setAttribute('clip-path', 'url(#' + id + ')');
                return p;
            }
        };
        return d;
    }

    var JETSON = [[576, 747, 25], [192, 443, 39], [81, 365, 50], [36, 346, 50], [9, 373, 43]];

    var drawings = {
        // ——— thumbnails: viewBox 240 x 150 ———
        thesis: function (d) {
            d.rect(20, 42, 30, 54, 'stroke', 5);
            d.line(30, 89, 40, 89);
            d.text(35, 112, 'client', { anchor: 'middle', cls: 'muted', size: 10 });
            d.path('M56 69 q 7 -10 14 0 t 14 0 t 14 0 t 14 0', 'stroke accent');
            d.text(84, 56, 'tokens only', { anchor: 'middle', cls: 'muted', size: 9.5 });
            d.rect(122, 20, 102, 108, 'stroke', 5);
            d.text(173, 36, 'H800 node', { anchor: 'middle', size: 10, weight: 600 });
            d.rect(132, 44, 82, 22, 'mid', 2);
            d.text(173, 59, 'VRAM · hot', { anchor: 'middle', size: 10, cls: 'mono' });
            d.rect(132, 72, 82, 22, 'soft', 2);
            d.text(173, 87, 'DRAM · cold', { anchor: 'middle', size: 10, cls: 'mono' });
            d.rect(132, 100, 82, 20, 'stroke faint', 2);
            d.text(173, 114, 'NVMe', { anchor: 'middle', size: 10, cls: 'mono muted' });
        },

        rareVideo: function (d) {
            d.rect(16, 42, 208, 66, 'stroke', 3);
            for (var i = 0; i < 13; i++) {
                d.rect(22 + i * 16, 47, 7, 5, 'soft', 1);
                d.rect(22 + i * 16, 98, 7, 5, 'soft', 1);
            }
            for (var f = 0; f < 5; f++) {
                d.rect(24 + f * 40, 57, 34, 36, f === 3 ? 'warn-fill' : 'soft', 2);
            }
            d.rect(144, 57, 34, 36, 'stroke warn', 2);
            d.text(161, 80, '!', { anchor: 'middle', size: 16, weight: 700, cls: 'warn' });
            d.text(120, 128, 'rare events, generated', { anchor: 'middle', size: 10, cls: 'muted' });
        },

        jetsonThumb: function (d) {
            var base = 120, s = 0.12;
            d.line(18, base, 226, base, 'stroke faint');
            JETSON.forEach(function (r, i) {
                var x = 30 + i * 40, h = r[1] * s, best = r[0] === 36;
                d.rect(x, base - h, 24, h, best ? 'mid' : 'soft', 2);
                if (best) d.rect(x, base - h, 24, h, 'stroke accent', 2);
                d.text(x + 12, base + 14, String(r[0]), { anchor: 'middle', size: 10, cls: best ? 'mono accent' : 'mono muted' });
            });
            d.line(18, base - 500 * s, 226, base - 500 * s, 'stroke warn dash', 1);
            d.text(224, base - 500 * s - 5, '500 ms', { anchor: 'end', size: 10, cls: 'warn' });
            d.text(64, 24, '747 ms', { size: 10, cls: 'mono muted' });
            d.text(162, 70, '346 ms', { anchor: 'middle', size: 10, cls: 'mono accent' });
            d.text(226, 147, 'image tokens', { anchor: 'end', size: 9.5, cls: 'muted' });
        },

        signalproof: function (d) {
            [[18, 30], [38, 56], [58, 82]].forEach(function (r) {
                d.rect(r[0], r[1], 96, 18, 'soft', 2);
                d.hatch(r[0] + 96, r[1], 12, 18, 4, 'stroke');
                d.rect(r[0] + 96, r[1], 12, 18, 'stroke thin', 0);
                d.rect(r[0] + 108, r[1], 34, 18, 'mid', 2);
            });
            d.text(66, 43, 'train', { anchor: 'middle', size: 10 });
            d.text(143, 43, 'test', { anchor: 'middle', size: 10 });
            d.text(84, 124, 'embargo gap', { anchor: 'middle', size: 10, cls: 'muted' });
            d.line(114, 103, 118, 112, 'stroke thin');
            d.rect(176, 104, 50, 24, 'stroke warn', 3);
            d.text(201, 120, 'FAIL', { anchor: 'middle', size: 11, weight: 600, cls: 'mono warn' });
        },

        sbd: function (d) {
            d.line(12, 126, 228, 126, 'stroke');
            d.line(12, 138, 228, 138, 'stroke');
            d.rect(22, 30, 72, 82, 'soft', 2);
            d.rect(22, 30, 72, 82, 'stroke thin', 2);
            d.rect(150, 46, 70, 66, 'soft', 2);
            d.rect(150, 46, 70, 66, 'stroke thin', 2);
            d.path('M100 124 L104 80 L114 16 L138 16 L128 80 L126 124 Z', 'stroke accent', 1.5);
            d.text(58, 75, 'A', { anchor: 'middle', size: 12, cls: 'muted' });
            d.text(185, 83, 'B', { anchor: 'middle', size: 12, cls: 'muted' });
            d.text(144, 30, 'wind corridor', { size: 9.5, cls: 'accent' });
            d.text(120, 148, 'street', { anchor: 'middle', size: 9, cls: 'muted' });
        },

        rag: function (d) {
            var s = 4.6;
            d.text(18, 40, 'local 4-bit', { size: 10, cls: 'muted' });
            d.rect(18, 46, 14.94 * s, 20, 'soft', 2);
            d.text(18 + 14.94 * s + 6, 60, '14.9 tok/s', { size: 10, cls: 'mono' });
            d.text(18, 88, 'NVIDIA NIM', { size: 10, cls: 'muted' });
            d.rect(18, 94, 33.66 * s, 20, 'mid', 2);
            d.text(18 + 33.66 * s + 6, 108, '33.7', { size: 10, cls: 'mono accent' });
            d.text(18, 136, 'RTX 4060, 8 GB', { size: 9.5, cls: 'muted' });
        },

        signed: function (d) {
            d.path('M60 118 L150 100 L190 30 L100 48 Z', 'soft');
            d.path('M60 118 L150 100 L190 30 L100 48 Z', 'stroke thin dash');
            d.arrow(60, 118, 150, 100, 'stroke accent');
            d.arrow(60, 118, 100, 48, 'stroke accent');
            d.text(108, 124, 'a', { size: 12, cls: 'accent' });
            d.text(70, 78, 'b', { size: 12, cls: 'accent' });
            d.text(204, 122, 'det[a b]', { anchor: 'end', size: 10, cls: 'mono muted' });
        },

        recycle: function (d) {
            d.rect(14, 56, 34, 34, 'soft', 17);
            d.rect(14, 56, 34, 34, 'stroke thin', 17);
            d.rect(26, 63, 10, 15, 'stroke thin', 5);
            d.line(31, 78, 31, 83, 'stroke thin');
            d.text(31, 106, 'mic', { anchor: 'middle', size: 10, cls: 'muted' });
            d.arrow(52, 73, 78, 73, 'stroke');
            d.text(65, 66, 'DMA', { anchor: 'middle', size: 9, cls: 'mono muted' });
            d.rect(82, 46, 60, 54, 'mid', 3);
            d.rect(82, 46, 60, 54, 'stroke accent', 3);
            d.text(112, 78, 'STM32', { anchor: 'middle', size: 11, weight: 600, cls: 'mono' });
            d.arrow(146, 62, 166, 44, 'stroke');
            d.arrow(146, 86, 166, 104, 'stroke');
            d.rect(170, 18, 56, 40, 'stroke thin', 3);
            [10, 18, 26, 14, 21].forEach(function (h, i) { d.rect(178 + i * 9, 50 - h, 6, h, 'mid', 1); });
            d.text(198, 70, 'LCD', { anchor: 'middle', size: 9.5, cls: 'muted' });
            d.rect(170, 90, 56, 34, 'stroke thin', 3);
            d.path('M188 115 L198 101 L208 115', 'stroke', 1.25);
            d.text(198, 138, 'servo sort', { anchor: 'middle', size: 9.5, cls: 'muted' });
        },

        // ——— project page figures ———
        vqaPipeline: function (d) {
            var boxes = [['camera', 10, 92], ['SigLIP', 128, 92], ['token pooling', 246, 120], ['Qwen2.5-0.5B', 392, 120], ['speech', 538, 92]];
            boxes.forEach(function (b, i) {
                d.rect(b[1], 14, b[2], 40, i === 2 ? 'mid' : 'soft', 4);
                d.rect(b[1], 14, b[2], 40, i === 2 ? 'stroke accent' : 'stroke thin', 4);
                d.text(b[1] + b[2] / 2, 39, b[0], { anchor: 'middle', size: 14 });
                if (i < boxes.length - 1) d.arrow(b[1] + b[2] + 3, 34, boxes[i + 1][1] - 4, 34, 'stroke');
            });
            var x0 = 10, w = 620, scale = w / 612;
            d.rect(x0, 120, 14 * scale, 30, 'mid', 0);
            d.rect(x0 + 14 * scale, 120, 41 * scale, 30, 'soft', 0);
            d.rect(x0 + 55 * scale, 120, 557 * scale, 30, 'warn-fill', 0);
            d.rect(x0, 120, w, 30, 'stroke thin', 0);
            d.line(x0 + 55 * scale, 120, x0 + 55 * scale, 150, 'stroke thin');
            d.text(x0, 112, 'capture 14 ms · SigLIP 41 ms', { size: 13, cls: 'muted' });
            d.text(x0 + 55 * scale + 10, 140, 'language model 557 ms', { size: 14, cls: 'warn' });
        },

        sweep: function (d) {
            var ox = 64, oy = 250, s = 0.28;
            d.line(ox, oy, 620, oy, 'stroke');
            [0, 200, 400, 600, 800].forEach(function (ms) {
                d.line(ox, oy - ms * s, 620, oy - ms * s, 'stroke faint', 1);
                d.text(ox - 8, oy - ms * s + 4, String(ms), { anchor: 'end', size: 12, cls: 'mono muted' });
            });
            d.text(18, oy - 110, 'mean latency (ms)', { anchor: 'middle', size: 12, cls: 'muted', rotate: -90 });
            JETSON.forEach(function (r, i) {
                var cx = 120 + i * 108, h = r[1] * s, best = r[0] === 36;
                d.rect(cx - 26, oy - h, 52, h, best ? 'mid' : 'soft', 2);
                if (best) d.rect(cx - 26, oy - h, 52, h, 'stroke accent', 2);
                var ly = oy - h - 8;
                if (Math.abs(ly - (oy - 500 * s)) < 14) ly = oy - h + 18;
                d.text(cx, ly, r[1] + ' ms', { anchor: 'middle', size: 13, cls: best ? 'mono accent' : 'mono' });
                d.text(cx, oy + 20, r[0] + ' tokens', { anchor: 'middle', size: 13 });
                d.text(cx, oy + 38, r[2] + '% correct', { anchor: 'middle', size: 12, cls: best ? 'accent' : 'muted' });
            });
            d.line(ox, oy - 500 * s, 620, oy - 500 * s, 'stroke warn dash', 1.5);
            d.text(618, oy - 500 * s - 7, '500 ms target', { anchor: 'end', size: 12, cls: 'warn' });
        }
    };

    function draw(host) {
        var fn = drawings[host.getAttribute('data-diagram')];
        if (!fn) return;
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', host.getAttribute('data-viewbox') || '0 0 240 150');
        svg.setAttribute('class', 'diagram');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', host.getAttribute('aria-label') || host.getAttribute('data-diagram'));
        host.insertBefore(svg, host.firstChild);
        fn(pen(svg));
    }

    // ——— project page: what average pooling does to an image ———
    // An illustration on a made-up street scene, not the model's real input.
    function initTokenGrid() {
        var host = document.getElementById('token-grid');
        if (!host) return;
        var svg = host.querySelector('svg');
        var readout = document.getElementById('token-readout');
        var buttons = document.querySelectorAll('.token-toggle button');
        var rows = {};
        JETSON.forEach(function (r) { rows[r[0]] = r; });

        function scene(u, v) {
            if (Math.hypot(u - 0.8, v - 0.2) < 0.075) return [0.2, 0.8, 0.35];
            if (u > 0.785 && u < 0.815 && v > 0.2 && v < 0.62) return [0.15, 0.15, 0.15];
            if (u > 0.73 && u < 0.87 && v > 0.08 && v < 0.32) return [0.12, 0.12, 0.14];
            if (v < 0.48) return [0.74, 0.79, 0.86];
            if (v < 0.56) return [0.55, 0.53, 0.5];
            var stripe = Math.floor(Math.pow((v - 0.56) / 0.44, 0.7) * 7) % 2 === 0;
            return stripe ? [0.93, 0.93, 0.9] : [0.28, 0.28, 0.3];
        }

        function render(n) {
            var g = Math.round(Math.sqrt(n)), cell = 300 / g, sub = Math.max(2, Math.round(48 / g));
            while (svg.firstChild) svg.removeChild(svg.firstChild);
            for (var r = 0; r < g; r++) {
                for (var c = 0; c < g; c++) {
                    var acc = [0, 0, 0];
                    for (var i = 0; i < sub; i++) for (var j = 0; j < sub; j++) {
                        var px = scene((c + (i + 0.5) / sub) / g, (r + (j + 0.5) / sub) / g);
                        acc[0] += px[0]; acc[1] += px[1]; acc[2] += px[2];
                    }
                    var k = sub * sub, rect = document.createElementNS(NS, 'rect');
                    rect.setAttribute('x', c * cell);
                    rect.setAttribute('y', r * cell);
                    rect.setAttribute('width', cell + 0.5);
                    rect.setAttribute('height', cell + 0.5);
                    rect.setAttribute('fill', 'rgb(' + Math.round(acc[0] / k * 255) + ',' + Math.round(acc[1] / k * 255) + ',' + Math.round(acc[2] / k * 255) + ')');
                    svg.appendChild(rect);
                }
            }
            var grid = document.createElementNS(NS, 'path'), dd = '';
            for (var t = 1; t < g; t++) dd += 'M' + t * cell + ' 0V300M0 ' + t * cell + 'H300';
            grid.setAttribute('d', dd);
            grid.setAttribute('stroke', 'rgba(0,0,0,0.22)');
            grid.setAttribute('stroke-width', g > 12 ? 0.4 : 1);
            svg.appendChild(grid);
            var row = rows[n];
            if (readout) readout.textContent = n + ' tokens (' + g + '×' + g + ') → ' + row[1] + ' ms mean latency, ' + row[2] + '% correct';
            buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.value) === n)); });
        }

        buttons.forEach(function (b) {
            b.addEventListener('click', function () { render(Number(b.value)); });
        });
        render(36);
    }

    function init() {
        document.querySelectorAll('[data-diagram]').forEach(draw);
        initTokenGrid();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
