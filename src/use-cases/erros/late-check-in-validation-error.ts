export class LateCheckInValidationError extends Error {
    constructor() {
        super(
            'The check-in can onlt be validate util 20 minutos of its creation',
        )
    }
}
