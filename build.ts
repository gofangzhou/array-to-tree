interface IProductType {
    id: string,
    pid: string,
    name: string
}

interface IProductTypeTree extends IProductType {
    children?: IProductType[]
}


const datas: IProductType[] = [
    { id: 'AA', pid: 'A', name: '筷子' },
    { id: 'AAA', pid: 'AA', name: '木筷' },
    { id: 'AB', pid: 'A', name: '勺子' },
    { id: 'C', pid: '', name: '房子' },
    { id: 'CA', pid: 'C', name: '混泥土结构' },
    { id: 'CB', pid: 'C', name: '木质结构' },
    { id: 'DA', pid: 'D', name: '箱子' },
];


/**
 * 通用数组转tree（递归版本）
 * @param datas 原始数据
 * @param idCode id属性命名
 * @param pidCode parentId属性命名
 * @param childCode tree结构，child属性命名
 * @param pidData 一级节点父ID的值
 * @returns 原始数据Tree结构数据
 */
const arrayTosTree = <T>(datas: T[], idCode: string, pidCode: string, childCode: string, pidData: any) => {
    let result: T[] = [];
    datas.forEach((item: any) => {
        if (item[pidCode] === pidData) {
            const children = arrayTosTree(datas, idCode, pidCode, childCode, item[idCode]);
            children.length && (item[childCode] = children);
            result.push(item);
        }
    });
    return result;
}

/**
 * 通用数组转tree（map类型版本）
 * @param datas 原始数据
 * @param idCode id属性命名
 * @param pidCode parentId属性命名
 * @param childCode tree结构，child属性命名
 * @param pidData 一级节点父ID的值
 * @returns 原始数据Tree结构数据
 */
const arrayTooTree = <T>(datas: T[], idCode: string, pidCode: string, childCode: string, pidData: any) => {
    let result: T[] = [];
    let map = {} as any;
    // 缓存数据
    datas.forEach((item: any) => {
        item[childCode] = [];
        map[item[idCode]] = item;
    });
    // 构建tree
    datas.forEach((item: any) => {
        let id = item[idCode];
        let pid = item[pidCode];

        if (pid === pidData) {
            result.push(map[id]);
        } else {
            // 借用对象的引用来实现
            if (!map[pid]) {
                map[pid] = { children: [] };
                result.push(map[id]);
            }
            map[pid][childCode].push(map[id]);
        }
    })
    return result;
}



/**
 * 通用数组转tree（map类型进阶版本）
 * @param datas 原始数据
 * @param idCode id属性命名
 * @param pidCode parentId属性命名
 * @param childCode tree结构，child属性命名
 * @param pidData 一级节点父ID的值
 * @returns 原始数据Tree结构数据
 */
const arrayToTree = <T>(datas: T[], idCode: string, pidCode: string, childCode: string, pidData: any) => {
    let result: T[] = [];
    let map: any = {};
    let objState: any = (() => {
        function d() { }
        return new (d as any)();
    })();
    datas.forEach((item: any) => {
        // 初始化
        const sid = item[idCode];
        const pid = item[pidCode];
        objState.__proto__[sid] = 1;
        map[sid] = Object.assign(item, map[sid] || {});
        if (pid !== pidData) {
            let parent = map[pid] || {};
            parent[childCode] || (parent[childCode] = []);
            parent[childCode].push(item);
            objState[pid] !== 1 && (objState[pid] = 0);
            objState[sid] === 0 && (objState[sid] = 1);
            map[pid] = parent;
        } else {
            objState[sid] = 1;
            result.push(map[sid]);
        }
    });
    Object.keys(objState).map(
        (key) => {
            console.log(key, objState[key]);
            objState[key] === 0 && result.push.apply(result, map[key][childCode]);
        }
    );
    return result;
}

const results = arrayToTree<IProductTypeTree>(datas, 'id', 'pid', 'children', '');
console.log(JSON.stringify(results));