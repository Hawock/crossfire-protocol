// db://assets/game/grid/GridDebugRenderer.ts
import { _decorator, Component, Graphics, Color } from 'cc';
import { GridManager } from "./GridManager";
import { CELL_STATE } from 'db://assets/vendor/sim-core';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('GridDebugRenderer')
@executeInEditMode(true)
export class GridDebugRenderer extends Component {
    @property(GridManager) grid!: GridManager;
    @property(Graphics) g!: Graphics;

    @property({ tooltip: 'Показывать только buildable' })
    onlyBuildable = false;

    redraw() {
        if (!this.grid || !this.g) return;
        if (this.grid.cols === 0 || this.grid.rows === 0) return;

        const build = this.grid.buildableAt ?? [];
        const state = this.grid.stateAt ?? [];
        const g = this.g;
        g.clear();

        const halfW = this.grid.tileW * 0.5;
        const halfH = this.grid.tileH * 0.5;

        for (let y = 0; y < this.grid.rows; y++) {
            for (let x = 0; x < this.grid.cols; x++) {
                const i = y * this.grid.cols + x;

                const canBuild = build[i] === true;         // безопасно, если undefined → false
                if (this.onlyBuildable && !canBuild) continue;

                const st = state[i] ?? CELL_STATE.FREE;

                let fill: Color;
                if (!canBuild) fill = new Color(220, 70, 70, 160);      // 🟥 not buildable
                else if (st === CELL_STATE.FREE) fill = new Color(0, 200, 80, 120); // 🟩 free
                else fill = new Color(80, 120, 220, 160);                   // 🟦 occupied/debris

                const p = this.grid.gridToWorld(x, y);
                g.fillColor = fill;
                g.strokeColor = new Color(0, 0, 0, 60);

                // ромб
                g.moveTo(p.x, p.y - halfH);
                g.lineTo(p.x + halfW, p.y);
                g.lineTo(p.x, p.y + halfH);
                g.lineTo(p.x - halfW, p.y);
                g.close(); g.fill(); g.stroke();
            }
        }
    }


    onEnable() {
        // дать гриду один кадр на onLoad()/инициализацию
        this.scheduleOnce(() => this.redraw(), 0);
    }
}
