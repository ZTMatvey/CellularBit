import CellType from "./cell-type";

class CellTypes{
    private _activeType!: CellType
    private _types: CellType[]
    constructor(types: CellType[]){
        if(types.length < 1) throw new Error('Types array must contain more than 0 elements')
        this._types = types;
        this._activeType = this._types[0]
    }
    setActiveTypeById(id: number){
        const element = this._types.find(x=> x.id === id)
        if(!element) throw new Error('Element does not exist')
        this._activeType = element
    }
    get activeType(): CellType{
        return this._activeType
    }
    get types(): CellType[]{
        return this._types
    }
}
export default CellTypes