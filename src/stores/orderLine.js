import { observable, computed, action } from 'mobx'

class OrderLine {
  @observable price = 99
  @observable amount = 33

  @computed
  get total() {
    return this.price * this.amount
  }

  @action.bound
  addPrice() {
    this.price += 1
  }



}

const orderLine = new OrderLine()
export default orderLine
