import { Input, Output, EventEmitter, Component } from '@angular/core';

@Component({
    template: ''
  })
class ControlButtonBase {
    @Input() isActive!: boolean
    @Output() onClick = new EventEmitter<Event>()

    onClickHandler(): void {
        this.onClick.emit()
    }
}

export default ControlButtonBase