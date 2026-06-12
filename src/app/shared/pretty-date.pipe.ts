import { Pipe, PipeTransform } from "@angular/core";
import { formatDistance } from "date-fns";
import { sv } from "date-fns/locale";

@Pipe({
  name: "prettyDate",
  standalone: true,
  pure: false
})
export class PrettyDatePipe implements PipeTransform {
  transform(value: any): string {
    return formatDistance(new Date(value), new Date(), { locale: sv, addSuffix: true });
  }
}
