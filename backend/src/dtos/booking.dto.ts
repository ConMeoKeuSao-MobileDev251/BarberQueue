export class CreateBookingDto {
    status: string
    startAt: Date
    endAt: Date
    totalDuration: number
    totalPrice: number

    clientId: number
    staffId: number
}