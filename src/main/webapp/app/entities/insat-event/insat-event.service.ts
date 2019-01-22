import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IInsatEvent } from 'app/shared/model/insat-event.model';
import { InsatEvent } from 'app/shared/model/insat-event.model';
import { Subject } from 'rxjs/internal/Subject';

type EntityResponseType = HttpResponse<IInsatEvent>;
type EntityArrayResponseType = HttpResponse<IInsatEvent[]>;

@Injectable({ providedIn: 'root' })
export class InsatEventService {
    public resourceUrl = SERVER_API_URL + 'api/insat-events';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/insat-events';

    constructor(private http: HttpClient) {}

    create(insatEvent: IInsatEvent): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(insatEvent);
        return this.http
            .post<IInsatEvent>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(insatEvent: IInsatEvent): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(insatEvent);
        return this.http
            .put<IInsatEvent>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }
    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IInsatEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IInsatEvent[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    loadAll(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IInsatEvent[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }
    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IInsatEvent[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(insatEvent: IInsatEvent): IInsatEvent {
        const copy: IInsatEvent = Object.assign({}, insatEvent, {
            date: insatEvent.date != null && insatEvent.date.isValid() ? insatEvent.date.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((insatEvent: IInsatEvent) => {
                insatEvent.date = insatEvent.date != null ? moment(insatEvent.date) : null;
            });
        }
        return res;
    }
    eventsList(): Observable<InsatEvent[]> {
        return this.http.get<InsatEvent[]>(SERVER_API_URL + 'api/insat-events/list');
    }
    public _subject = new Subject<object>();
    public event = this._subject.asObservable();

    public publish(data: any) {
        this._subject.next(data);
    }
}
