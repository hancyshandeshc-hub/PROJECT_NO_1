from pydantic import BaseModel


class UserInput(BaseModel):

    MONTH: int
    DISTRICT: str
    RH2M: float
    T2M: float
    WS10M: float
    PS: float
    PRECTOT_LAST_MONTH: float
    RH2M_LAST_MONTH: float
