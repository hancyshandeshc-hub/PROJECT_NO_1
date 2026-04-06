from pydantic import BaseModel, Field, computed_field, field_validator
from typing import Literal, Annotated
class UserInput(BaseModel):
	name:Annotated[str,Field(
							...,
               				description="Name of the Car",
							)]

	company:Annotated[str,Field(
							...,
               				description="Name of the Company",
							)]
	year:Annotated[int,Field(
							...,
               				gt=0,
							description="When was the car purchased",
							)]
	kms_driven:Annotated[int,Field(
							...,
               				gt=0,
							description="Kilometers Driven by the Car",
							)]	
	@field_validator("name")
	@classmethod
	def normalize_feature1(cls,v:str)->str:
		v=v.strip().title()
		return v
	@field_validator("company")
	@classmethod
	def normalize_feature2(cls,v:str)->str:
		v=v.strip().title()
		return v
	
