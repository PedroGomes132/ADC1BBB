import logger from "../../logger";

export default {
  async linhabonus(idjson: string) {
    const jsons: any = {
      [1]: {
        "0": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 6
          },
          fs: {
            s: 0,
            ts: 20,
            as: 0,
            aw: 1476,
            gt: 2
          },
          rv: [6, 6, 3, 3, 1, 30, 3, 6, 30],
          rwsp: {
            "1": 6
          },
          rl: [3, 3, 2, 3, 1, 8, 2, 3, 4],
          fstc: {
            "2": 20
          },
          rsrl: [1, 3, 1, 3, 1, 8, 3, 4, 1],
          rsrv: [0.6, 6, 0.6, 3, 1, 30, 6, 30, 0.6],
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 20,
            as: 0,
            aw: 1470,
            gt: 2
          },
          rv: [6, 0.6, 3, 5, 0, 1, 60, 3, 0.6],
          rwsp: null,
          rl: [3, 1, 2, 4, 0, 1, 5, 2, 1],
          fstc: {
            "2": 19
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 300
          },
          fs: {
            s: 2,
            ts: 20,
            as: 0,
            aw: 1470,
            gt: 2
          },
          rv: [60, 60, 60, 1, 5, 3, 6, 60, 3],
          rwsp: {
            "1": 300
          },
          rl: [5, 5, 5, 14, 4, 3, 3, 5, 2],
          fstc: {
            "2": 18
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: null,
          lw: null,
          fs: {
            s: 3,
            ts: 20,
            as: 0,
            aw: 1170,
            gt: 2
          },
          rv: [6, 30, 3, 10, 0, 10, 60, 0, 6],
          rwsp: null,
          rl: [3, 4, 2, 5, 0, 5, 5, 0, 3],
          fstc: {
            "2": 17
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 20,
            as: 0,
            aw: 1170,
            gt: 2
          },
          rv: [60, 0, 3, 1, 0, 15, 60, 3, 60],
          rwsp: null,
          rl: [5, 0, 2, 1, 0, 6, 5, 2, 5],
          fstc: {
            "2": 16
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: null,
          lw: null,
          fs: {
            s: 5,
            ts: 20,
            as: 0,
            aw: 1170,
            gt: 2
          },
          rv: [6, 6, 30, 1, 0, 50, 30, 0, 3],
          rwsp: null,
          rl: [3, 3, 4, 1, 0, 10, 4, 0, 2],
          fstc: {
            "2": 15
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "6": {
          wp: null,
          lw: null,
          fs: {
            s: 6,
            ts: 20,
            as: 0,
            aw: 1170,
            gt: 2
          },
          rv: [6, 0, 0.6, 40, 0, 100, 30, 0, 0.6],
          rwsp: null,
          rl: [3, 0, 1, 9, 0, 11, 4, 0, 1],
          fstc: {
            "2": 14
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "7": {
          wp: null,
          lw: null,
          fs: {
            s: 7,
            ts: 20,
            as: 0,
            aw: 1170,
            gt: 2
          },
          rv: [60, 0.6, 3, 40, 0, 3, 3, 0, 60],
          rwsp: null,
          rl: [5, 1, 2, 9, 0, 3, 2, 0, 5],
          fstc: {
            "2": 13
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "8": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 180
          },
          fs: {
            s: 8,
            ts: 20,
            as: 0,
            aw: 1170,
            gt: 2
          },
          rv: [30, 6, 30, 5, 30, 1, 30, 6, 30],
          rwsp: {
            "1": 180
          },
          rl: [4, 3, 4, 4, 8, 1, 4, 3, 4],
          fstc: {
            "2": 12
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "9": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 150
          },
          fs: {
            s: 9,
            ts: 20,
            as: 0,
            aw: 990,
            gt: 2
          },
          rv: [6, 30, 30, 40, 5, 2, 6, 30, 6],
          rwsp: {
            "1": 150
          },
          rl: [3, 4, 4, 9, 4, 2, 3, 4, 3],
          fstc: {
            "2": 11
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "10": {
          wp: null,
          lw: null,
          fs: {
            s: 10,
            ts: 20,
            as: 0,
            aw: 840,
            gt: 2
          },
          rv: [3, 6, 60, 3, 0, 2, 0.6, 0, 0.6],
          rwsp: null,
          rl: [2, 3, 5, 3, 0, 2, 1, 0, 1],
          fstc: {
            "2": 10
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "11": {
          wp: null,
          lw: null,
          fs: {
            s: 11,
            ts: 20,
            as: 0,
            aw: 840,
            gt: 2
          },
          rv: [3, 6, 60, 2, 0, 5, 6, 0, 0.6],
          rwsp: null,
          rl: [2, 3, 5, 2, 0, 4, 3, 0, 1],
          fstc: {
            "2": 9
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "12": {
          wp: null,
          lw: null,
          fs: {
            s: 12,
            ts: 20,
            as: 0,
            aw: 840,
            gt: 2
          },
          rv: [0.6, 0, 30, 10, 0, 20, 30, 0, 6],
          rwsp: null,
          rl: [1, 0, 4, 5, 0, 7, 4, 0, 3],
          fstc: {
            "2": 8
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "13": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 30
          },
          fs: {
            s: 13,
            ts: 20,
            as: 0,
            aw: 840,
            gt: 2
          },
          rv: [6, 30, 0.6, 100, 1, 5, 3, 30, 30],
          rwsp: {
            "1": 30
          },
          rl: [3, 4, 1, 11, 1, 4, 2, 4, 4],
          fstc: {
            "2": 7
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "14": {
          wp: null,
          lw: null,
          fs: {
            s: 14,
            ts: 20,
            as: 0,
            aw: 810,
            gt: 2
          },
          rv: [3, 0, 3, 1, 5, 30, 30, 3, 3],
          rwsp: null,
          rl: [2, 0, 2, 1, 4, 8, 4, 2, 2],
          fstc: {
            "2": 6
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "15": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 300
          },
          fs: {
            s: 15,
            ts: 20,
            as: 0,
            aw: 810,
            gt: 2
          },
          rv: [6, 30, 3, 20, 10, 3, 3, 30, 6],
          rwsp: {
            "1": 300
          },
          rl: [3, 4, 2, 7, 5, 3, 2, 4, 3],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "16": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 30
          },
          fs: {
            s: 16,
            ts: 20,
            as: 0,
            aw: 510,
            gt: 2
          },
          rv: [3, 30, 6, 20, 1, 10, 3, 30, 6],
          rwsp: {
            "1": 30
          },
          rl: [2, 4, 3, 7, 1, 5, 2, 4, 3],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "17": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 450
          },
          fs: {
            s: 17,
            ts: 20,
            as: 0,
            aw: 480,
            gt: 2
          },
          rv: [6, 30, 0.6, 5, 15, 2, 6, 30, 60],
          rwsp: {
            "1": 450
          },
          rl: [3, 4, 1, 4, 6, 2, 3, 4, 5],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "18": {
          wp: null,
          lw: null,
          fs: {
            s: 18,
            ts: 20,
            as: 0,
            aw: 30,
            gt: 2
          },
          rv: [6, 0, 30, 1, 0, 2, 6, 0, 0.6],
          rwsp: null,
          rl: [3, 0, 4, 1, 0, 2, 3, 0, 1],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "19": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 30
          },
          fs: {
            s: 19,
            ts: 20,
            as: 0,
            aw: 30,
            gt: 2
          },
          rv: [3, 30, 6, 20, 1, 10, 30, 30, 6],
          rwsp: {
            "1": 30
          },
          rl: [2, 4, 3, 7, 1, 5, 4, 4, 3],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "20": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.6
          },
          fs: {
            s: 20,
            ts: 20,
            as: 0,
            aw: 0,
            gt: 2
          },
          rv: [30, 0.6, 6, 40, 1, 2, 3, 0.6, 30],
          rwsp: {
            "1": 0.6
          },
          rl: [4, 1, 3, 9, 14, 2, 2, 1, 4],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [2]: {
        "0": {
          wp: null,
          lw: null,
          fs: {
            s: 0,
            ts: 5,
            as: 0,
            aw: 120,
            gt: 0
          },
          rv: [30, 3, 6, 1, 1, 40, 3, 0, 0.6],
          rwsp: null,
          rl: [4, 2, 3, 14, 1, 9, 2, 0, 1],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 5,
            as: 0,
            aw: 120,
            gt: 0
          },
          rv: [30, 6, 6, 10, 2, 1, 30, 0, 6],
          rwsp: null,
          rl: [4, 3, 3, 5, 2, 1, 4, 0, 3],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 120
          },
          fs: {
            s: 2,
            ts: 5,
            as: 0,
            aw: 120,
            gt: 0
          },
          rv: [6, 60, 6, 10, 2, 20, 6, 60, 6],
          rwsp: {
            "1": 120
          },
          rl: [3, 5, 3, 5, 2, 7, 3, 5, 3],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: null,
          lw: null,
          fs: {
            s: 3,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.6, 0, 6, 1, 0, 1, 0.6, 0, 0.6],
          rwsp: null,
          rl: [1, 0, 3, 1, 0, 1, 1, 0, 1],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [6, 0, 3, 2, 1, 1, 30, 0, 60],
          rwsp: null,
          rl: [3, 0, 2, 2, 1, 1, 4, 0, 5],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 6
          },
          fs: {
            s: 5,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [6, 6, 6, 20, 1, 30, 30, 6, 6],
          rwsp: {
            "1": 6
          },
          rl: [3, 3, 3, 7, 12, 8, 4, 3, 3],
          fstc: null,
          rsrl: [1, 5, 4, 7, 12, 8, 3, 2, 4],
          rsrv: [0.6, 60, 30, 20, 1, 30, 6, 3, 30],
          st: 1,
          nst: 2
        }
      },
      [3]: {
        "0": {
          wp: null,
          lw: null,
          fs: {
            s: 0,
            ts: 10,
            as: 0,
            aw: 12.5,
            gt: 1
          },
          rv: [10, 0, 5, 30, 2, 20, 0.1, 0.5, 0.5],
          rwsp: null,
          rl: [5, 0, 4, 8, 2, 7, 1, 2, 2],
          fstc: {
            "2": 10
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 10,
            as: 0,
            aw: 12.5,
            gt: 1
          },
          rv: [1, 1, 10, 1, 0, 1, 1, 0.5, 0.5],
          rwsp: null,
          rl: [3, 3, 5, 12, 0, 1, 3, 2, 2],
          fstc: {
            "2": 9
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 10
          },
          fs: {
            s: 2,
            ts: 10,
            as: 0,
            aw: 12.5,
            gt: 1
          },
          rv: [0.1, 5, 1, 3, 20, 30, 10, 5, 5],
          rwsp: {
            "1": 10
          },
          rl: [1, 4, 3, 3, 2, 8, 5, 4, 4],
          fstc: {
            "2": 8
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 3,
            ts: 10,
            as: 0,
            aw: 2.5,
            gt: 1
          },
          rv: [1, 0.5, 0.1, 1, 2, 3, 0.1, 0.5, 0.1],
          rwsp: {
            "1": 1
          },
          rl: [3, 2, 1, 14, 2, 3, 1, 2, 1],
          fstc: {
            "2": 7
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 10,
            as: 0,
            aw: 1.5,
            gt: 1
          },
          rv: [1, 0.1, 5, 1, 1, 1, 1, 0, 1],
          rwsp: null,
          rl: [3, 1, 4, 1, 1, 1, 3, 0, 3],
          fstc: {
            "2": 6
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: null,
          lw: null,
          fs: {
            s: 5,
            ts: 10,
            as: 0,
            aw: 1.5,
            gt: 1
          },
          rv: [1, 0.1, 0.1, 15, 0, 1, 10, 0, 5],
          rwsp: null,
          rl: [3, 1, 1, 6, 0, 1, 5, 0, 4],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "6": {
          wp: null,
          lw: null,
          fs: {
            s: 6,
            ts: 10,
            as: 0,
            aw: 1.5,
            gt: 1
          },
          rv: [10, 0, 10, 1, 2, 10, 0.5, 0, 0.5],
          rwsp: null,
          rl: [5, 0, 5, 1, 2, 5, 2, 0, 2],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "7": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 7,
            ts: 10,
            as: 0,
            aw: 1.5,
            gt: 1
          },
          rv: [5, 1, 1, 1, 1, 15, 0.5, 1, 1],
          rwsp: {
            "1": 1
          },
          rl: [4, 3, 3, 1, 1, 6, 2, 3, 3],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "8": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.5
          },
          fs: {
            s: 8,
            ts: 10,
            as: 0,
            aw: 0.5,
            gt: 1
          },
          rv: [5, 0.5, 1, 5, 1, 100, 1, 0.5, 0.1],
          rwsp: {
            "1": 0.5
          },
          rl: [4, 2, 3, 4, 1, 11, 3, 2, 1],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "9": {
          wp: null,
          lw: null,
          fs: {
            s: 9,
            ts: 10,
            as: 0,
            aw: 0,
            gt: 1
          },
          rv: [0.1, 10, 0.1, 20, 2, 2, 0.1, 0, 5],
          rwsp: null,
          rl: [1, 5, 1, 7, 2, 2, 1, 0, 4],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "10": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 10,
            ts: 10,
            as: 0,
            aw: 0,
            gt: 1
          },
          rv: [0.5, 1, 1, 10, 1, 2, 10, 1, 0.1],
          rwsp: {
            "1": 1
          },
          rl: [2, 3, 3, 5, 13, 2, 5, 3, 1],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [5]: {
        "0": {
          wp: null,
          lw: null,
          fs: {
            s: 0,
            ts: 10,
            as: 0,
            aw: 21.5,
            gt: 1
          },
          rv: [0.5, 0.5, 0.1, 20, 1, 1, 0.5, 0, 1],
          rwsp: null,
          rl: [2, 2, 1, 7, 1, 1, 2, 0, 3],
          fstc: {
            "2": 10
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 10,
            as: 0,
            aw: 21.5,
            gt: 1
          },
          rv: [1, 5, 0.1, 2, 0, 10, 0.5, 0, 5],
          rwsp: null,
          rl: [3, 4, 1, 2, 0, 5, 2, 0, 4],
          fstc: {
            "2": 9
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 5
          },
          fs: {
            s: 2,
            ts: 10,
            as: 0,
            aw: 21.5,
            gt: 1
          },
          rv: [10, 1, 10, 1, 5, 1, 5, 1, 5],
          rwsp: {
            "1": 5
          },
          rl: [5, 3, 5, 1, 4, 1, 4, 3, 4],
          fstc: {
            "2": 8
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 10
          },
          fs: {
            s: 3,
            ts: 10,
            as: 0,
            aw: 16.5,
            gt: 1
          },
          rv: [1, 5, 10, 10, 20, 1, 5, 5, 0.1],
          rwsp: {
            "1": 10
          },
          rl: [3, 4, 5, 5, 2, 13, 4, 4, 1],
          fstc: {
            "2": 7
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 3
          },
          fs: {
            s: 4,
            ts: 10,
            as: 0,
            aw: 6.5,
            gt: 1
          },
          rv: [1, 1, 10, 30, 3, 2, 5, 1, 0.5],
          rwsp: {
            "1": 3
          },
          rl: [3, 3, 5, 8, 3, 2, 4, 3, 2],
          fstc: {
            "2": 6
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1.5
          },
          fs: {
            s: 5,
            ts: 10,
            as: 0,
            aw: 3.5,
            gt: 1
          },
          rv: [5, 0.5, 1, 40, 3, 3, 0.5, 0.5, 0.5],
          rwsp: {
            "1": 1.5
          },
          rl: [4, 2, 3, 9, 3, 3, 2, 2, 2],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "6": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 6,
            ts: 10,
            as: 0,
            aw: 2,
            gt: 1
          },
          rv: [5, 0.5, 5, 5, 2, 40, 1, 0.5, 10],
          rwsp: {
            "1": 1
          },
          rl: [4, 2, 4, 4, 2, 9, 3, 2, 5],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "7": {
          wp: null,
          lw: null,
          fs: {
            s: 7,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [5, 0, 1, 30, 2, 15, 1, 5, 0.5],
          rwsp: null,
          rl: [4, 0, 3, 8, 2, 6, 3, 4, 2],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "8": {
          wp: null,
          lw: null,
          fs: {
            s: 8,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [1, 0.1, 10, 5, 0, 5, 1, 0, 0.5],
          rwsp: null,
          rl: [3, 1, 5, 4, 0, 4, 3, 0, 2],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "9": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 9,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [0.1, 0.5, 0.5, 3, 2, 1, 1, 0.5, 0.5],
          rwsp: {
            "1": 1
          },
          rl: [1, 2, 2, 3, 2, 1, 3, 2, 2],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "10": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.5
          },
          fs: {
            s: 10,
            ts: 10,
            as: 0,
            aw: 0,
            gt: 1
          },
          rv: [1, 0.5, 10, 15, 1, 5, 1, 0.5, 1],
          rwsp: {
            "1": 0.5
          },
          rl: [3, 2, 5, 6, 13, 4, 3, 2, 3],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [6]: {
        "0": {
          wp: null,
          lw: null,
          fs: {
            s: 0,
            ts: 10,
            as: 0,
            aw: 4.2,
            gt: 1
          },
          rv: [0.1, 0, 1, 3, 1, 20, 1, 0, 0.5],
          rwsp: null,
          rl: [1, 0, 3, 3, 1, 7, 3, 0, 2],
          fstc: {
            "2": 10
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.2
          },
          fs: {
            s: 1,
            ts: 10,
            as: 0,
            aw: 4.2,
            gt: 1
          },
          rv: [1, 0.1, 0.5, 3, 2, 1, 0.5, 0.1, 1],
          rwsp: {
            "1": 0.2
          },
          rl: [3, 1, 2, 3, 2, 1, 2, 1, 3],
          fstc: {
            "2": 9
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: null,
          lw: null,
          fs: {
            s: 2,
            ts: 10,
            as: 0,
            aw: 4,
            gt: 1
          },
          rv: [0.1, 0.1, 1, 2, 2, 3, 5, 0, 0.1],
          rwsp: null,
          rl: [1, 1, 3, 2, 2, 3, 4, 0, 1],
          fstc: {
            "2": 8
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 3
          },
          fs: {
            s: 3,
            ts: 10,
            as: 0,
            aw: 4,
            gt: 1
          },
          rv: [0.5, 1, 5, 50, 3, 2, 0.5, 1, 5],
          rwsp: {
            "1": 3
          },
          rl: [2, 3, 4, 10, 3, 2, 2, 3, 4],
          fstc: {
            "2": 7
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [0.1, 0, 0.1, 1, 1, 1, 5, 0.1, 0.5],
          rwsp: null,
          rl: [1, 0, 1, 13, 1, 1, 4, 1, 2],
          fstc: {
            "2": 6
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1.5
          },
          fs: {
            s: 5,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [5, 0.5, 1, 40, 3, 3, 0.5, 0.5, 0.5],
          rwsp: {
            "1": 1.5
          },
          rl: [4, 2, 3, 9, 3, 3, 2, 2, 2],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "6": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 6,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [5, 0.5, 5, 5, 2, 40, 1, 0.5, 10],
          rwsp: {
            "1": 1
          },
          rl: [4, 2, 4, 4, 2, 9, 3, 2, 5],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "7": {
          wp: null,
          lw: null,
          fs: {
            s: 7,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [5, 0, 1, 30, 2, 15, 1, 5, 0.5],
          rwsp: null,
          rl: [4, 0, 3, 8, 2, 6, 3, 4, 2],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "8": {
          wp: null,
          lw: null,
          fs: {
            s: 8,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [1, 0.1, 10, 5, 0, 5, 1, 0, 0.5],
          rwsp: null,
          rl: [3, 1, 5, 4, 0, 4, 3, 0, 2],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "9": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 9,
            ts: 10,
            as: 0,
            aw: 1,
            gt: 1
          },
          rv: [5, 0.1, 10, 1, 10, 3, 10, 0.1, 0.5],
          rwsp: {
            "1": 1
          },
          rl: [4, 5, 5, 1, 5, 3, 5, 5, 2],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "10": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.1
          },
          fs: {
            s: 10,
            ts: 10,
            as: 0,
            aw: 0,
            gt: 1
          },
          rv: [0.1, 0.1, 0.5, 1, 1, 15, 5, 0.1, 0.5],
          rwsp: {
            "1": 0.1
          },
          rl: [1, 5, 2, 1, 13, 6, 4, 5, 2],
          fstc: null,
          rsrl: [1, 3, 4, 1, 13, 6, 5, 2, 3],
          rsrv: [0.1, 1, 5, 1, 1, 15, 10, 0.5, 1],
          st: 1,
          nst: 2
        }
      },
      [7]: {
        "0": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 3
          },
          fs: {
            s: 0,
            ts: 5,
            as: 0,
            aw: 6,
            gt: 0
          },
          rv: [30, 3, 30, 1, 1, 20, 60, 3, 30],
          rwsp: {
            "1": 3
          },
          rl: [4, 2, 4, 12, 1, 7, 5, 2, 4],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 3
          },
          fs: {
            s: 1,
            ts: 5,
            as: 0,
            aw: 3,
            gt: 0
          },
          rv: [3, 3, 3, 30, 1, 1, 6, 3, 6],
          rwsp: {
            "1": 3
          },
          rl: [2, 2, 2, 8, 1, 1, 3, 2, 3],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: null,
          lw: null,
          fs: {
            s: 2,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [3, 0, 3, 1, 3, 20, 6, 0, 6],
          rwsp: null,
          rl: [2, 0, 2, 12, 3, 7, 3, 0, 3],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: null,
          lw: null,
          fs: {
            s: 3,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [6, 0, 0.6, 10, 2, 3, 30, 0, 6],
          rwsp: null,
          rl: [3, 0, 1, 5, 2, 3, 4, 0, 3],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [6, 6, 3, 5, 2, 3, 6, 0, 6],
          rwsp: null,
          rl: [3, 3, 2, 4, 2, 3, 3, 0, 3],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 30
          },
          fs: {
            s: 5,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [6, 30, 30, 2, 1, 2, 0.6, 30, 30],
          rwsp: {
            "1": 30
          },
          rl: [3, 4, 4, 2, 12, 2, 1, 4, 4],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [8]: {
        "0": {
          wp: null,
          lw: null,
          fs: {
            s: 0,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.6, 60, 30, 20, 1, 1, 60, 0, 30],
          rwsp: null,
          rl: [1, 5, 4, 7, 1, 1, 5, 0, 4],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.6, 0, 3, 1, 2, 1, 3, 60, 60],
          rwsp: null,
          rl: [1, 0, 2, 1, 2, 1, 2, 5, 5],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: null,
          lw: null,
          fs: {
            s: 2,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.6, 0, 30, 10, 1, 3, 30, 0, 60],
          rwsp: null,
          rl: [1, 0, 4, 5, 12, 3, 4, 0, 5],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: null,
          lw: null,
          fs: {
            s: 3,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [3, 0, 60, 50, 5, 10, 60, 0.6, 6],
          rwsp: null,
          rl: [2, 0, 5, 10, 4, 5, 5, 1, 3],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [30, 0, 6, 1, 2, 20, 30, 6, 30],
          rwsp: null,
          rl: [4, 0, 3, 1, 2, 7, 4, 3, 4],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 60
          },
          fs: {
            s: 5,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.6, 60, 30, 15, 1, 2, 60, 60, 3],
          rwsp: {
            "1": 60
          },
          rl: [1, 5, 4, 6, 12, 2, 5, 5, 2],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [9]: {
        "0": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 30
          },
          fs: {
            s: 0,
            ts: 5,
            as: 0,
            aw: 43.8,
            gt: 0
          },
          rv: [30, 0.6, 0.6, 1, 50, 1, 0.6, 0.6, 3],
          rwsp: {
            "1": 30
          },
          rl: [4, 1, 1, 1, 10, 14, 1, 1, 2],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 5,
            as: 0,
            aw: 13.8,
            gt: 0
          },
          rv: [30, 0, 0.6, 3, 1, 1, 0.6, 0.6, 6],
          rwsp: null,
          rl: [4, 0, 1, 3, 1, 12, 1, 1, 3],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1.8
          },
          fs: {
            s: 2,
            ts: 5,
            as: 0,
            aw: 13.8,
            gt: 0
          },
          rv: [6, 0.6, 60, 2, 3, 2, 60, 0.6, 60],
          rwsp: {
            "1": 1.8
          },
          rl: [3, 1, 5, 2, 3, 2, 5, 1, 5],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 12
          },
          fs: {
            s: 3,
            ts: 5,
            as: 0,
            aw: 12,
            gt: 0
          },
          rv: [6, 6, 6, 1, 2, 30, 6, 6, 6],
          rwsp: {
            "1": 12
          },
          rl: [3, 3, 3, 1, 2, 8, 3, 3, 3],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [30, 30, 0.6, 1, 2, 3, 6, 0, 30],
          rwsp: null,
          rl: [4, 4, 1, 1, 2, 3, 3, 0, 4],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 3
          },
          fs: {
            s: 5,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [3, 3, 0.6, 1, 1, 10, 30, 3, 6],
          rwsp: {
            "1": 3
          },
          rl: [2, 2, 1, 1, 12, 5, 4, 2, 3],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [10]: {
        "0": {
          wp: null,
          lw: null,
          fs: {
            s: 0,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [10, 0.5, 5, 1, 1, 15, 10, 0, 0.5],
          rwsp: null,
          rl: [5, 2, 4, 1, 1, 6, 5, 0, 2],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [5, 10, 5, 1, 1, 10, 0.1, 0, 10],
          rwsp: null,
          rl: [4, 5, 4, 14, 1, 5, 1, 0, 5],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: null,
          lw: null,
          fs: {
            s: 2,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.5, 0, 0.5, 1, 2, 1, 0.1, 0.5, 5],
          rwsp: null,
          rl: [2, 0, 2, 1, 2, 1, 1, 2, 4],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: null,
          lw: null,
          fs: {
            s: 3,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [5, 0, 0.1, 1, 2, 2, 1, 0.5, 1],
          rwsp: null,
          rl: [4, 0, 1, 12, 2, 2, 3, 2, 3],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [1, 0, 1, 1, 2, 2, 1, 0, 0.5],
          rwsp: null,
          rl: [3, 0, 3, 1, 2, 2, 3, 0, 2],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 5,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.1, 1, 10, 3, 1, 1, 1, 1, 5],
          rwsp: {
            "1": 1
          },
          rl: [1, 3, 5, 3, 12, 1, 3, 3, 4],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [11]: {
        "0": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.1
          },
          fs: {
            s: 0,
            ts: 5,
            as: 0,
            aw: 1.3,
            gt: 0
          },
          rv: [0.1, 0.1, 1, 1, 1, 1, 5, 0.1, 0.5],
          rwsp: {
            "1": 0.1
          },
          rl: [1, 1, 3, 12, 1, 1, 4, 1, 2],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 1
          },
          fs: {
            s: 1,
            ts: 5,
            as: 0,
            aw: 1.2,
            gt: 0
          },
          rv: [0.5, 0.5, 0.1, 1, 2, 1, 1, 0.5, 10],
          rwsp: {
            "1": 1
          },
          rl: [2, 2, 1, 14, 2, 12, 3, 2, 5],
          fstc: {
            "2": 4
          },
          rsrl: [3, 4, 5, 14, 2, 12, 4, 1, 4],
          rsrv: [1, 5, 10, 1, 2, 1, 5, 0.1, 5],
          st: 2,
          nst: 2
        },
        "2": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.2
          },
          fs: {
            s: 2,
            ts: 5,
            as: 0,
            aw: 0.2,
            gt: 0
          },
          rv: [10, 0.1, 5, 1, 2, 5, 1, 0.1, 1],
          rwsp: {
            "1": 0.2
          },
          rl: [5, 1, 4, 1, 2, 4, 3, 1, 3],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: null,
          lw: null,
          fs: {
            s: 3,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [1, 1, 1, 2, 0, 3, 0.5, 0, 5],
          rwsp: null,
          rl: [3, 3, 3, 2, 0, 3, 2, 0, 4],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [1, 5, 0.5, 40, 0, 2, 5, 0, 0.5],
          rwsp: null,
          rl: [3, 4, 2, 9, 0, 2, 4, 0, 2],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 10
          },
          fs: {
            s: 5,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [5, 10, 0.5, 20, 1, 3, 5, 10, 0.5],
          rwsp: {
            "1": 10
          },
          rl: [4, 5, 2, 7, 12, 3, 4, 5, 2],
          fstc: null,
          rsrl: null,
          rsrv: null,
          st: 1,
          nst: 2
        }
      },
      [12]: {
        "0": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.2
          },
          fs: {
            s: 0,
            ts: 5,
            as: 0,
            aw: 0.2,
            gt: 0
          },
          rv: [10, 0.1, 1, 3, 2, 1, 0.5, 0.1, 5],
          rwsp: {
            "1": 0.2
          },
          rl: [5, 1, 3, 3, 2, 1, 2, 1, 4],
          fstc: {
            "2": 5
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 1
        },
        "1": {
          wp: null,
          lw: null,
          fs: {
            s: 1,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [1, 0, 0.1, 1, 0, 5, 1, 1, 5],
          rwsp: null,
          rl: [3, 0, 1, 1, 0, 4, 3, 3, 4],
          fstc: {
            "2": 4
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "2": {
          wp: null,
          lw: null,
          fs: {
            s: 2,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.5, 0, 1, 1, 1, 2, 5, 0, 0.5],
          rwsp: null,
          rl: [2, 0, 3, 1, 1, 2, 4, 0, 2],
          fstc: {
            "2": 3
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "3": {
          wp: null,
          lw: null,
          fs: {
            s: 3,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [10, 0, 0.5, 1, 1, 30, 1, 0, 0.1],
          rwsp: null,
          rl: [5, 0, 2, 13, 1, 8, 3, 0, 1],
          fstc: {
            "2": 2
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "4": {
          wp: null,
          lw: null,
          fs: {
            s: 4,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.1, 5, 10, 1, 2, 3, 5, 0, 5],
          rwsp: null,
          rl: [1, 4, 5, 1, 2, 3, 4, 0, 4],
          fstc: {
            "2": 1
          },
          rsrl: null,
          rsrv: null,
          st: 2,
          nst: 2
        },
        "5": {
          wp: {
            "1": [1, 4, 7]
          },
          lw: {
            "1": 0.1
          },
          fs: {
            s: 5,
            ts: 5,
            as: 0,
            aw: 0,
            gt: 0
          },
          rv: [0.5, 0.1, 10, 20, 1, 50, 0.5, 0.1, 1],
          rwsp: {
            "1": 0.1
          },
          rl: [2, 1, 5, 7, 12, 10, 2, 1, 3],
          fstc: null,
          rsrl: [2, 2, 2, 7, 12, 10, 2, 4, 2],
          rsrv: [0.5, 0.5, 0.5, 20, 1, 50, 0.5, 5, 0.5],
          st: 1,
          nst: 2
        }
      }
    };

            return jsons[idjson]
          },
     }       